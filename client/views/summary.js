/*global lodash, Reports, Works */

Reports = new Mongo.Collection("reports");

// Display Helpers
Template.registerHelper('scoreRateClass', r => r >= 0.8 ? 'high' : (r < 0.5 ? 'low' : ''));
var getReviewDisplayClass = r => r && r.feedback && r.feedback.trim().length > 0 ? '': 'short';
var getRequirementDisplayClass = r => r && r.comment && r.comment.trim().length > 0 ? '': 'bubble';

// Calculators
var calculateReviewResult = function (review) {
  var result = lodash.reduce(review.results, function(t, r) {
    return {
      total: t.total + r.score || 0,
      earned: t.earned + (r.result && r.score && r.result.value ? r.result.value * r.score : 0)
    };
  }, { earned: 0, total: 0 });
  result.rate = result.earned / (result.total || 1);
  return result;
};

var mapReviewScore = r => lodash.map(r, q => lodash.set(q, 'score', calculateReviewResult(q)));

var getRequirementsList = report => lodash(report).values().reduce((t, r) => {
    var res = lodash.map(r.results, q => lodash.pick(q, ['title', 'score', 'result', 'task']));
    res = lodash.map(res, q => lodash.set(q, 'user', r.user));
    return t.concat(res);
  }, []);

var groupRequirements = function(lst, fields) {
  var reqs = lodash.reduce(lst, function (a, r) {
      var key = lodash(r).pick(fields).values().value();
      a[key] = a[key] || {
        title: r.title,
        score: r.score,
        reviews: []
      };
      a[key].reviews.push(r);
      return a;
    }, {});
  return lodash.values(reqs);
};

var getRequirementResult = function (reviews) {
  var r = lodash(reviews).countBy('result.value').toPairs()
    .orderBy([1, 0], ['desc', 'desc']).value()[0][0];
  return lodash.toSafeInteger(r[0]);
};

var calculateRequirementsStat = lst => lodash.map(lst, function (r) {
    r.result = getRequirementResult(r.reviews);
    r.rate = r.result / (r.score || 1);
    return r;
  });

var rebuildReportByRequirements = function(report) {
  if (report) {
    var result = getRequirementsList(report);
    result = groupRequirements(result, ['title', 'score']);
    return calculateRequirementsStat(result);
  }
};

var calculateWorkScore = report => lodash(rebuildReportByRequirements(report))
  .reduce(function(t, r) {
    t.result += r.result;
    t.total += r.score;
    return t;
  }, {result: 0, total: 0});

var calculateReviewsStat = report => report && mapReviewScore(lodash.values(report));

// Templates
Template.work_report.onCreated(function () {
  this.autorun(() => {
    var data = Template.currentData();
    if (data) {
      this.subscribe("reports", data.id);
      this.subscribe('user-work', data.id);
    }
  });
});

Template.work_report.helpers({
  work: function () { return Works.findOne({_id: this.id}); },
  report: function () { return Reports.findOne({_id: this.id}); },
  workScore: calculateWorkScore,
});

Template.work_summary_reviews.helpers({
  reports: calculateReviewsStat,
  reviewFeedbackStyle: getReviewDisplayClass,
});

Template.work_summary_requirements.helpers({
  requirements: rebuildReportByRequirements,
  requirementFeedbackStyle: getRequirementDisplayClass,
});