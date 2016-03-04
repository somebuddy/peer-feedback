/*global Router, Requirements, lodash, Reviews */

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
});

Template.workReviewState.events({
  'click .ready-state': function () {
    Router.go('/work/' + this.work._id + '/summary');
  }
});

