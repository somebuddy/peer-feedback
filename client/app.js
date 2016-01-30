/*global angular, ProjectAssignments, moment, Router*/

Template.registerHelper('timeLeft', function(date) {
  return moment(date).fromNow();
});

Template.registerHelper('dueCSSClass', function(date) {
  return moment().isSameOrAfter(date) ? 'overdue' : '';
});

Template.assignments_list.helpers({
  assignments: function () {
    return ProjectAssignments.find({});
  }
});

Template.assignments_list.events({
  'click .widget.assignment': function (event) {
    console.log(this);
    Router.go('/assignment/' + this._id);
  }
});

