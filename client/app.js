/*global angular, ProjectAssignments, moment, Router, lodash*/

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
  return req === 1 ? 'no' : (req === 2? 'yes' : '');
});

Template.review_checklist.events({
  'submit .check-list': function (event) {
    // Check if all selected
    if (!lodash(this.requirements).every('result')) {
      alert('Please make a choice for every requirement');
      return false;
    };

    // Prepare database object
    var review = {
      work: this.work._id,
      assignment: this.assignment._id,
      results: lodash.map(this.requirements, function (req) {
        return {
          requirement: req._id,
          result: req.result
        };
      }),
      feedback: event.target.feedback.value
    };

    // Save to database
    console.log('Review done: ', review);
  }
});

Template.check_requirement.onCreated(function () {
  this.checkResult = new ReactiveVar(this.data.requirement.result || null);
});

Template.check_requirement.helpers({
  checkResult: function() {
    return Template.instance().checkResult.get();
  }
});

Template.check_requirement.events({
  'click .check-switcher .yes': function (event, template) {
    this.requirement.result = 2;
    template.checkResult.set( this.requirement.result );
  },
  'click .check-switcher .no': function (event, template) {
    this.requirement.result = 1;
    template.checkResult.set( this.requirement.result );
  }
});