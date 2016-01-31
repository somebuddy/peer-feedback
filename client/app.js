/*global angular, ProjectAssignments, moment, Router*/

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('llll');
});


Template.registerHelper('timeLeft', function(date) {
  return moment(date).fromNow();
});

Template.registerHelper('dueCSSClass', function(date) {
  return moment().isSameOrAfter(date) ? 'overdue' : '';
});

Template.registerHelper('routeName', function() {
  return Router.current().route.getName();
});

Template.registerHelper('sum', function(a, b) {
  return a + b;
});

Template.assignments_list.helpers({
  assignments: function () {
    return ProjectAssignments.find({});
  }
});

Template.assignments_list.events({
  'click .widget.assignment': function (event) {
    var current = Router.current().route.path();
    Router.go(current + '/' + this._id);
  }
});

Template.submit_work.events({
  'click .close-button': function (event) {
    $(event.currentTarget).closest('.modal-wrapper').removeClass('show');
  },
  'click .modal': function (event) {
    return false;
  },
  'click .modal-wrapper': function (event) {
    $(event.currentTarget).closest('.modal-wrapper').removeClass('show');
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

Template.registerHelper('getMark', function(req) {
  console.log(req);
  return req === 1 ? 'no' : (req === 2? 'yes' : '');
});

Template.review_checklist.events({
  'click .check-switcher .yes': function (event) {
    this.result = 2;
  },
  'click .check-switcher .no': function (event) {
    this.result = 1;
  },
  'click .submit-review': function (event) {
    return false;
  },
});