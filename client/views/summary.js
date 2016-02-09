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

Template.work_summary_content.helpers({
  'summary': function () {
    var reviews = Reviews.find({work: this._id}).fetch();
  },
  'reviews': function () {
    return Reviews.find({work: this._id});
  },
  'reviewScore': function (review) {
    return getReviewResult(review).earned;
  },
  'scoreRate': function(review) {
    var s = getReviewResult(review).earned;
    var t = getAssignmentScore(review.assignment);
    var r = (s || 0) / (t || 1);
    return r >= 0.8 ? 'high' : (r < 0.5 ? 'low' : '');
  },
  'requirements': function () {
    return Requirements.find({assignment: this.assignment});
  },
  'reviewFeedbackStyle': function (review) {
    return review && review.feedback && review.feedback.trim().length > 0 ? 'full': 'short';
  },
  'requirementScoreRate': function (r) {
    return r && (r.result > 0) ? 'high' : 'low';
  },
  'requirementsSummary': function () {
    var reqs = Requirements.find({assignment: this.assignment}).fetch();
    var revs = Reviews.find({work: this._id}).fetch();
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
})