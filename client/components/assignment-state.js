/*global Works, Router*/

function getUserWorks (assignment) {
  return Works.find({
    assignment: assignment,
    user: Meteor.userId(),
  }, {sort: {createdAt: -1}});
}

Template.assignment_state.helpers({
  'lastWork': function () {
    Meteor.subscribe('user-works-for-assignment', this._id);
    return Works.findOne({
      assignment:this._id,
      user: Meteor.userId(),
    }, {sort: {createdAt: -1}});
  },
  'isHistoryExist': function () {
    Meteor.subscribe('user-works-for-assignment', this._id);
    return getUserWorks(this._id).count() > 1;
  },
  'previousWorksCount': function () {
    Meteor.subscribe('user-works-for-assignment', this._id);
    return getUserWorks(this._id).count();
  },
  'canReview': function () {
    return Works.find({assignment:this._id}).count() > 0;
  },
  'submittionCount': function () {
    return Works.find({assignment:this._id}).count();
  },
});

Template.assignment_state.events({
  'click .submit-button': function (event) {
    $('#submit-work-modal').addClass('show');
  },
  'click .review-button': function (event) {
    Router.go('/make-review/' + this._id);
  }
})