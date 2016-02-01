/*global angular, ProjectAssignments, Works, Reviews, moment, Router, lodash*/

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

Template.registerHelper('console', function(a) {
  console.log(a);
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
  'submit form': function (event) {
    console.log(this);
    event.preventDefault();

    var work = {
      assignment: this._id,
      userName: event.target.user_name.value,
      sourceUrl: event.target.source_url.value,
      previewUrl: event.target.preview_url.value,
      comments: event.target.comments.value,
      createdAt: new Date(),
    };
    Works.insert(work);
    $(event.target).closest('.modal-wrapper').removeClass('show');
  },
  'click .modal-wrapper': function (event) {
    if ($(event.target).is($('.modal-wrapper'))) {
      $(event.target).removeClass('show');
    }
  },
});