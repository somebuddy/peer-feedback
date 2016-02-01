/*global Router, Works */

Template.assignment_submits.helpers({
  'canReview': function () {
    return Works.find({assignment:this._id}).count() > 0;
  },
  'submittionCount': function () {
    return Works.find({assignment:this._id}).count();
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