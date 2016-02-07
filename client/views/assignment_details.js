/*global Router, Works, Reviews */

Template.assignment_submits.helpers({
  'canReview': function () {
    return Works.find({assignment:this._id}).count() > 0;
  },
  'submittionCount': function () {
    return Works.find({assignment:this._id}).count();
  },
  'lastWork': function () {
    return Works.findOne({assignment:this._id}, {sort: {createdAt: -1}});
  }
});

Template.assignment_details_header.events({
  'click .submit-button': function (event) {
    $('#submit-work-modal').addClass('show');
  },
  'click .history-button': function (event) {
    $('#previous-works-modal').addClass('show');
  },
  'click .review-button': function (event) {
    Router.go('/make-review/' + this._id);
  },
});

Template.workReviewState.helpers({
  'isReady': function () {
    return Reviews.find({work: this.work._id}).count() >= 3;
  },
  'workReviewSummary': function () {
    var reviews = Reviews.find({work: this.work._id}).fetch();
    var total = 0;
    Requirements.find({assignment: this.work.assignment}).forEach(function (el) {
      total += el.score;
    });

    // statistics for each review
    var score = lodash.map(reviews, function (rq) {
      var stat = lodash.reduce(rq.results, function(t, r) {
        t.earned += (r.result ? r.result.value || 0 : 0) * (r.score || 0);
        t.total += (r.score || 0);
        return t;
      }, { earned: 0, total: 0});
      stat.percent = Math.min(stat.earned / (stat.total || 1), 1);
      return stat;
    });
    // aggregated statistics
    score = lodash.sumBy(score, 'percent') / score.length;

    return {
      score: lodash.round(score * total, 1),
      total: total
    };
  }
})