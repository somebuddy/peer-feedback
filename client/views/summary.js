/*global lodash, Reviews, Requirements, Reports, Works */

Reports = new Mongo.Collection("reports");

// -----------------------------------------------------------------------------
// Work summary widget
// -----------------------------------------------------------------------------

var getWorkScore = function (report) {
  // concat all requirements from all reviews
  var result = lodash(report.result)
    .values()
    .reduce(function (t, r) {
      var results = lodash(r.results)
        .map((req) => lodash.pick(req, ['title', 'score', 'result', 'task']))
        .map((req) => lodash.set(req, 'user', r.user))
        .value();
      return t.concat(results);
    }, []);

  // regroup by requirements
  result = lodash(result)
    .reduce(function (a, r) {
      var key = [r.title];
      if (!a[key]) {
        a[key] = { reviews: [r]};
        a[key].title = r.title;
        a[key].score = r.score;
      } else {
        a[key].reviews.push(r);
      }
      return a;
    }, {});

  result = lodash(result)
    .values()
    .reduce (function(t, r) {
      t.result += getRequirementResult(r.reviews);
      t.total += r.score;
      return t;
    }, {result: 0, total: 0});

  return result;
};

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
  'workScore': function () {
    var report = Reports.findOne({_id: this.workId});
    if (report && report.result) {
      return getWorkScore(report);
    }
  },
});

function getAssignmentScore(assignment) {
  var reqs = Requirements.find({assignment: assignment}).fetch();
  return lodash.sumBy(reqs, 'score');
}

// Counters

// -----------------------------------------------------------------------------
// Review summary
// -----------------------------------------------------------------------------

// Score for user review
var reviewResult = function (review) {
  var result = lodash.reduce(review.results, function(t, r) {
    return {
      total: t.total + r.score || 0,
      earned: t.earned + (r.result && r.score && r.result.value ? r.result.value * r.score : 0)
    };
  }, { earned: 0, total: 0 });
  result.rate = result.earned / (result.total || 1);
  return result;
};

var mapReviewScore = (r) => lodash(r).values().map((r) => lodash.set(r, 'score', reviewResult(r))).value();

// Score for particular requirement by all users
var getRequirementResult = function (reviews) {
  // count result by simple majority
  var result = lodash(reviews)
    .countBy('result.value')
    .toPairs()
    .maxBy(1)[0];
  return lodash.toSafeInteger(result);
};

Template.work_summary_reviews.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var data = Template.currentData();
    if (data) self.subscribe("reports", data.workId);
  });
});

var getReviewRateClass = (r) => { return r >= 0.8 ? 'high' : (r < 0.5 ? 'low' : '') };
var getReviewDisplayClass = (r) => { return r && r.feedback && r.feedback.trim().length > 0 ? '': 'short' };

Template.work_summary_reviews.helpers({
  reports: function () {
    var reps = Reports.findOne({_id: this.workId});
    if (reps && reps.result) reps.result = mapReviewScore(reps.result);
    return reps || {};
  },
  reviewFeedbackStyle: getReviewDisplayClass,
  scoreRate: getReviewRateClass
});

// -----------------------------------------------------------------------------
// Requirement statistic
// -----------------------------------------------------------------------------

Template.work_summary_requirements.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var data = Template.currentData();
    if (data) self.subscribe("reports", data.workId);
  });
});

Template.work_summary_requirements.helpers({
  requirements: function() {
    var reps = Reports.findOne({_id: this.workId});
    if (reps && reps.result) {
      // concat all requirements from all reviews
      var result = lodash(reps.result)
        .values()
        .reduce(function (t, r) {
          var results = lodash(r.results)
            .map((req) => lodash.pick(req, ['title', 'score', 'result', 'task']))
            .map((req) => lodash.set(req, 'user', r.user))
            .value();
          return t.concat(results);
        }, []);

      // group requirements
      result = lodash(result)
        .reduce(function (a, r) {
          var key = [r.title, r.score];
          if (!a[key]) {
            a[key] = { reviews: [r]};
            a[key].title = r.title;
            a[key].score = r.score;
          } else {
            a[key].reviews.push(r);
          }
          return a;
        }, {});

      // build the list
      reps.result = lodash(result)
        .values()
        .map(function (r) {
          r.result = getRequirementResult(r.reviews);
          r.rate = r.result / (r.score || 1);
          return r;
        })
        .value();
    }
    return reps || {};
  },
  requirementFeedbackStyle: (r) => { return r && r.result && r.result.comment ? '' : 'bubble'; },
  requirementScoreRate: (r) => { return r && r.result && r.result.value ? 'high' : 'low'; },
  requirementSummaryScoreRate: getReviewRateClass
});