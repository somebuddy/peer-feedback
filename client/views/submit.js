/*global Works, Reviews, lodash */

Template.submitted_works_list.events({
  'click .close-button': function (event) {
    $(event.currentTarget).closest('.modal-wrapper').removeClass('show');
  },
});

Template.submitted_works_list.helpers({
  'list': function() {
    var works = Works.find({assignment:this._id}).fetch();
    return works;
  },
  'workReviewResult': function (work) {
    var reviews = Reviews.find({work: work._id}).fetch();
    var score = lodash.reduce(reviews, function(t, rev) {
      var s = lodash.filter(rev.results, function(r) {
        return r.result == 2;
      });
      return t + (s.length || 0);
    }, 0);
    // TODO: reviews count
    // TODO: average score
    return {
      count: reviews.length,
      score: score,
      avg: Math.round(score / reviews.length, 2)
    };
  }
});