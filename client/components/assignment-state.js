/*global Works, Router*/

Template.assignment_state.helpers({
  'canReview': function () {
    return Works.find({assignment:this._id}).count() > 0;
  },
  'submittionCount': function () {
    return Works.find({assignment:this._id}).count();
  },
  'lastWork': function () {
    return Works.findOne({assignment:this._id}, {sort: {createdAt: -1}});
  }
});

Template.assignment_state.events({
  'click .submit-button': function (event) {
    $('#submit-work-modal').addClass('show');
  },
  'click .history-button': function (event) {
    $('#previous-works-modal').addClass('show');
  },
  'click .review-button': function (event) {
    Router.go('/make-review/' + this._id);
  }
})