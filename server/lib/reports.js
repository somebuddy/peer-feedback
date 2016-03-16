/*global Works, Reviews */

Meteor.publish('work-reviews', function(id) {
  var work = Works.findOne({ _id: id });
  var result = Reviews.find({ work: id });
  // console.log(this.userId);

  // if (!work) this.error(new Meteor.Error(404, "Work is not found"));
  // if (!work.public && work.user !== this.userId) throw new Meteor.Error(403, "Work is private");

  // if (result.count() < 3) throw new Meteor.Error(412, "Report is not ready");

  // if (work.madeReviews >= 3) {
  //   return result;
  // }

  return this.ready();
});

var getChanger = function (pub, collection, docId) {
  return function (result, error) {
    console.log('Send: ', !!result, !!error);
    pub.changed(collection, docId, {
      error: error,
      result: !error ? result : undefined
    });
  }
}

var getWorkChecker = function (workId, userId) {
  return function(doc) {
    console.log('Checking doc: ', doc.public, doc.user);
    if (!doc) return new Meteor.Error(404, "Work is not found");
    if (!doc.public && doc.user !== userId) return new Meteor.Error(403, "Work is private");
    if (doc.madeReviews < 3) return new Meteor.Error(412, "Not enough reviews");
  }
};

Meteor.publish('reports', function(workId) {
  var self = this;
  var work = Works.find({ _id: workId });
  console.log(this.userId, 'Work count:', work.count());
  var error = work.count() > 0 ? undefined : new Meteor.Error(404, "Work is not found");
  var reviews = {};

  // todo: make as arrow function
  var changer = getChanger(self, "reports", workId);
  var checker = getWorkChecker(workId, this.userId);

  self.added("reports", workId, {});

  var workHandle = work.observe({
    added: function(doc) {
      if (doc._id === workId) {
        console.log('Added', doc);
        error = checker(doc);
        changer(reviews, error);
      }
    },
    removed: function (doc) {
      if (doc._id === workId) {
        console.log('Removed');
        error = checker(undefined);
        changer(reviews, error);
      }
    },
    changed: function(doc) {
      if (doc._id === workId) {
        console.log('Changed');
        error = checker(doc);
        changer(reviews, error);
      }
    }
  });

  var handle = Reviews.find({ work: workId, finished: true }).observe({
    added: function (review) {
      reviews[review._id] = review;
      changer(reviews, error);
    },
    removed: function (review) {
      reviews[review._id] = undefined;
      changer(reviews, error);
    }
  });

  self.ready();

  self.onStop(function () {
    workHandle.stop();
    handle.stop();
  });
});