/*global lodash, Reports, Works */

Reports = new Mongo.Collection("reports");

// Template Helpers
var getReviewRateClass = (r) => { return r >= 0.8 ? 'high' : (r < 0.5 ? 'low' : '') };
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

var calculateReviewsStat = function (report) {
  if (report && report.result) report.result = mapReviewScore(lodash.values(report.result));
  return report || {};
};

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
  var result = lodash(reviews).countBy('result.value').toPairs().maxBy(1)[0];
  return lodash.toSafeInteger(result);
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

// -----------------------------------------------------------------------------

// Work summary
Template.work_summary_result.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var data = Template.currentData();
    if (data) {
      self.subscribe("reports", data.workId);
      self.subscribe('user-work', data.workId);
    }
  });
});

Template.work_summary_result.helpers({
  work: function () {
    return Works.findOne({_id: this.workId});
  },
  workScore: function () {
    var report = Reports.findOne({_id: this.workId});
    return calculateWorkScore(report);
  },
});

// Review summary
Template.work_summary_reviews.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var data = Template.currentData();
    if (data) self.subscribe("reports", data.workId);
  });
});

Template.work_summary_reviews.helpers({
  reports: function () {
    var report = Reports.findOne({_id: this.workId});
    return calculateReviewsStat(report);
  },
  reviewFeedbackStyle: getReviewDisplayClass,
  scoreRate: getReviewRateClass
});

// Requirement statistic
Template.work_summary_requirements.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var data = Template.currentData();
    if (data) self.subscribe("reports", data.workId);
  });
});

Template.work_summary_requirements.helpers({
  requirements: function() {
    var report = Reports.findOne({_id: this.workId});
    return rebuildReportByRequirements(report);
  },
  requirementFeedbackStyle: getRequirementDisplayClass,
  requirementScoreRate: getReviewRateClass,
});