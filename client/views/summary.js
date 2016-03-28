/*global lodash, Reports, Works */

Reports = new Mongo.Collection("reports");

// Template Helpers
Template.registerHelper('scoreRateClass', (r) => { return r >= 0.8 ? 'high' : (r < 0.5 ? 'low' : '') });

var getReviewDisplayClass = (r) => { return r && r.feedback && r.feedback.trim().length > 0 ? '': 'short' };
var getRequirementDisplayClass = (r) => { return r && r.comment && r.comment.trim().length > 0 ? '': 'bubble' };


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

var mapReviewScore = (r) => lodash.map(r, (r) => lodash.set(r, 'score', calculateReviewResult(r)));

var getRequirementsList = function (report) {
  return lodash(report.result).values()
    .reduce(function (t, r) {
      var results = lodash.map(r.results, (req) => lodash.pick(req, ['title', 'score', 'result', 'task']));
      results = lodash.map(results, (req) => lodash.set(req, 'user', r.user));
      return t.concat(results);
    }, []);
};

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

var calculateRequirementsStat = function(lst) {
  return lodash.map(lst, function (r) {
    r.result = getRequirementResult(r.reviews);
    r.rate = r.result / (r.score || 1);
    return r;
  });
};

var rebuildReportByRequirements = function(report) {
  if (report && report.result) {
    var result = getRequirementsList(report);
    result = groupRequirements(result, ['title', 'score']);
    report.result = calculateRequirementsStat(result);
  }
  return report || {};
};

var calculateWorkScore = function (report) {
  report = rebuildReportByRequirements(report);
  return lodash(report.result).reduce(function(t, r) {
    t.result += r.result;
    t.total += r.score;
    return t;
  }, {result: 0, total: 0});
};

var calculateReviewsStat = function (report) {
  if (report && report.result) report.result = mapReviewScore(lodash.values(report.result));
  return report || {};
};

// Work report
Template.work_report.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var data = Template.currentData();
    if (data) {
      self.subscribe("reports", data.id);
      self.subscribe('user-work', data.id);
    }
  });
});

Template.work_report.helpers({
  work: function () { return Works.findOne({_id: this.id}); },
  report: function () { return Reports.findOne({_id: this.id}); },
  workScore: function () {
    var report = Reports.findOne({_id: this.id});
    return calculateWorkScore(report);
  },
});

// Review summary
Template.work_summary_reviews.helpers({
  reports: function () {
    var report = Reports.findOne({_id: this.workId});
    return calculateReviewsStat(report);
  },
  reviewFeedbackStyle: getReviewDisplayClass,
});

// Requirement statistic
Template.work_summary_requirements.helpers({
  requirements: function() {
    var report = Reports.findOne({_id: this.workId});
    return rebuildReportByRequirements(report);
  },
  requirementFeedbackStyle: getRequirementDisplayClass,
});