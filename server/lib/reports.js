/*global Works, Reviews */

var getChanger = function (pub, collection, docId) {
  return function (result, error) {
    pub.changed(collection, docId, {
      error: error,
      result: !error ? result : undefined
    });
  };
};

var getWorkChecker = function (workId, userId) {
  return function(doc) {
    if (!doc) return new Meteor.Error(404, "Work is not found");
    if (!doc.public && doc.user !== userId) return new Meteor.Error(403, "Work is private");
    if ((doc.madeReviews || 0) < 3) return new Meteor.Error(412, "Not enough reviews");
  };
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
        error = checker(doc);
        changer(reviews, error);
      }
    },
    removed: function (doc) {
      if (doc._id === workId) {
        error = checker(undefined);
        changer(reviews, error);
      }
    },
    changed: function(doc) {
      if (doc._id === workId) {
        error = checker(doc);
        changer(reviews, error);
      }
    }
  });

  var handle = Reviews.find({ work: workId }).observe({
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