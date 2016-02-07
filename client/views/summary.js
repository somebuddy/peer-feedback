function getReviewResult (review) {
  var r = lodash.reduce(review.results, function (t, r) {
    t.total += r.score || 0;
    t.earned += r.result ? r.result.value || 0 : 0;
    return t;
  }, { earned: 0, total: 0});
  return r.earned;
}

Template.work_summary_content.helpers({
  'summary': function () {
    console.log(this);
    var reviews = Reviews.find({work: this._id}).fetch();
  },
  'reviews': function () {
    console.log(Reviews.find({work: this._id}).count());
    return Reviews.find({work: this._id});
  },
  'reviewScore': function (review) {
    return getReviewResult(review);
  },
  'requirements': function () {
    console.log(this);
    return Requirements.find({assignment: this.assignment});
  }
})