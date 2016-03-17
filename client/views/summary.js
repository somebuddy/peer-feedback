/*global lodash, Reviews, Requirements, Reports, lodash */

Reports = new Mongo.Collection("reports");

Template.work_summary_reviews.helpers({
  reviews: function () {
    console.log(this);
    Meteor.subscribe('reports', this._id, {
      onError: function(error) {
        console.log('On error', error);
      },
      onReady: function(result) {
        console.log('On result', result);
      }
    });
    var reps = Reports.findOne({_id: this._id});
    console.log(reps);
    if (reps && reps.result) {
      reps.result = lodash.values(reps.result);
    }
    return reps || {};
  },
  reviewFeedbackStyle: function () {

  },
  scoreRate: function () {

  },
  reviewScore: function () {

  },
  report: function() {
    Meteor.subscribe("reports", this._id);
    var result = Reports.findOne(this._id);
    console.log(result);
    // console.log(Reviews.find({}).fetch());
    // console.log(Works.find({}).fetch());
    return result;
  }
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