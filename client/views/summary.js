/*global lodash, Reviews, Requirements, Reports, lodash */

Reports = new Mongo.Collection("reports");

Template.work_summary_reviews.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var data = Template.currentData();
    if (data) {
      self.subscribe("reports", data.workId);
    }
  });
});

var reviewResult = function (review) {
  return lodash.reduce(review.results, function(t, r) {
    var score = r.score || 0;
    t.total += score;
    t.earned += (r.result ? r.result.value || 0 : 0) * score;
    return t;
  }, {
    earned: 0,
    total: 0
  });
};

var getReviewRateClass = (r) => { return r >= 0.8 ? 'high' : (r < 0.5 ? 'low' : '') };
var getReviewDisplayClass = (r) => { return r && r.feedback && r.feedback.trim().length > 0 ? '': 'short' };

Template.work_summary_reviews.helpers({
  reports: function () {
    var reps = Reports.findOne({_id: this.workId});

    if (reps && reps.result) {
      reps.result = lodash(reps.result)
        .values()
        .map(function (review) {
          var s = reviewResult(review);
          review.score = s;
          review.rate = s && s.total ? s.earned / s.total : 0;
          return review;
        })
        .value();
    }

    return reps || {};
  },
  reviewFeedbackStyle: getReviewDisplayClass,
  scoreRate: getReviewRateClass
});

Template.work_summary_requirements.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var data = Template.currentData();
    if (data) {
      self.subscribe("reports", data.workId);
    }
  });
});

var getRequirementResult = function (reviews) {
  // count result by simple majority
  var result = lodash(reviews)
    .countBy('result.value')
    .toPairs()
    .maxBy(0)
    // .value();
  console.log(result);
};

Template.work_summary_requirements.helpers({
  requirements: function() {
    var reps = Reports.findOne({_id: this.workId});
    if (reps && reps.result) {
      // concat all requirements from all reviews
      var result = lodash(reps.result)
        .values()
        .reduce(function (t, r) {
          var results = lodash.map(r.results, function (req) {
            req.user = r.user;
            return req;
          });
          return t.concat(results);
        }, []);

      // group requirements
      result = lodash(result)
        .reduce(function (a, r) {
          var key = [r._id, r.title, r.score];
          if (!a[key]) {
            a[key] = { reviews: [r]};
            a[key]._id = r._id;
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
          return r;
        })
        .value();
      // console.log(reps.result);
    }
    return reps || {};
  },
  requirementFeedbackStyle: (r) => { return r && r.result && r.result.comment ? '' : 'bubble'; },
  requirementScoreRate: (r) => { return r && r.result && r.result.value ? 'high' : 'low'; }
});

function checkWorkState (work_id) {
  // Report is ready when:
  // - user made enough review after submit this work (so, need counter)
  // - work have enough reviews (so, need parameter into assignment details)
  // - reviews should be in done state
  // - no active reviews (not done for this work)

  var reviews = Reviews.find({work: work_id});
  // Check if enough reviews
}

function getReviewResult (review) {
  var r = lodash.reduce(review.results, function (t, r) {
    t.total += r.score || 0;
    t.earned += r.result ? r.result.value || 0 : 0;
    return t;
  }, { earned: 0, total: 0});
  return r;
}

function getRequirementReview (rev, req) {
  // Find in review result for particular requiremnt
  if (!rev || !req) return;

  var res = {
    user: rev.user,
    requirement: req
  };

  var r = lodash.find(rev.results, ['_id', req]);
  res.result = r && r.result ? r.result.value || 0 : 0;
  res.feedback = r && r.result ? r.result.comment : undefined;

  return res;
}

function getAssignmentScore(assignment) {
  var reqs = Requirements.find({assignment: assignment}).fetch();
  return lodash.sumBy(reqs, 'score');
}

function aggregateRequirements(work) {
  var reqs = Requirements.find({assignment: work.assignment}).fetch();
  var revs = Reviews.find({work: work._id}).fetch();
  return lodash.map(reqs, function (rq) {
    rq.reviews = lodash.map(revs, function(rv) {
      return getRequirementReview(rv, rq._id);
    });
    var earnd = lodash.filter(rq.reviews, 'result').length;
    var tot = rq.reviews.length;
    rq.result = earnd > 0.5 * tot ? rq.score : 0;
    return rq;
  });
}

Template.work_summary_result.helpers({
  'workScore': function () {
    var reviews = aggregateRequirements(this);

    return {
      result: lodash.sumBy(reviews, 'result'),
      total: getAssignmentScore(this.assignment),
    };
  },
  'workScoreRate': function () {
    var r = (this.result || 0) / (this.total || 1);
    return r >= 0.8 ? 'high' : 'low';
  },
});

Template.work_reviews_results.helpers({
  'reviews': function () {
    console.log(Reviews.find({work: this._id}).fetch());
    return Reviews.find({work: this._id});
  },
  'reviewFeedbackStyle': function (review) {
    return review && review.feedback && review.feedback.trim().length > 0 ? '': 'short';
  },
  'scoreRate': function(review) {
    var s = getReviewResult(review).earned;
    var t = getAssignmentScore(review.assignment);
    var r = (s || 0) / (t || 1);
    return r >= 0.8 ? 'high' : (r < 0.5 ? 'low' : '');
  },
  'reviewScore': function (review) {
    return getReviewResult(review).earned;
  },
});

Template.work_reviews_details.helpers({
  'requirementsSummary': function () {
    return aggregateRequirements(this);
  },
  'requirementScoreRate': function (r) {
    return r && (r.result > 0) ? 'high' : 'low';
  },
  'reviewFeedbackStyle': function (review) {
    var summaryClass = review && review.feedback && review.feedback.trim().length > 0 ? 'small': 'bubble';
    return summaryClass;
  },
});