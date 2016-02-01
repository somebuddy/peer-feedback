/*global lodash, Reviews */

Template.registerHelper('getMark', function(req) {
  return req === 1 ? 'no' : (req === 2? 'yes' : '');
});

Template.review_checklist.events({
  'submit .check-list': function (event) {
    event.preventDefault();
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
    Reviews.insert(review);
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