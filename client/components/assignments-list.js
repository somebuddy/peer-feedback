/*global Assignments, Router */

Template.assignments_list.helpers({
  assignments: function () {
    return Assignments.find({});
  }
});

Template.assignments_list.events({
  'click .widget.assignment': function (event) {
    var current = Router.current().route.path();
    Router.go(current + '/' + this._id);
  }
});