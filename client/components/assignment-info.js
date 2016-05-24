/*global Assignments, Router*/

Template.assignment_info.helpers({
  'info': function (data) {
    Meteor.subscribe('assignment', this.id);
    return Assignments.findOne({_id: this.id});
  }
});

Template.assignment_info.events({
  'click .project-link': function () {
    Router.go('assignment.list');
  },
  'click .parent-path': function () {
    Router.go('assignment.list');
  },
  'click .js-open-assignment': function() {
    Router.go('assignment.open', {_id: this._id});
  }
});