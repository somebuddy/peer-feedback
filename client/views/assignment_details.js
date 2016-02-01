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
    $('.modal-wrapper').addClass('show');
  },
  'click .review-button': function (event) {
    Router.go('/make-review/' + this._id);
  },
});