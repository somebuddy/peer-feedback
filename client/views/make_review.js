/*global lodash, Reviews, Router, WorkForReview, ProjectAssignments, Requirements */

WorkForReview = new Mongo.Collection('work-review-next');

/* Debug helpers */
function warnkWorkForReviewCollection () {
  if (WorkForReview.find().count() > 1) {
    console.warn('In work for review collection more than 1 document. It sucks. Here is what we have: ', WorkForReview.find().fetch());
  }
}

/* Other helpers */
function prepareNewReview (assignment) {
  /**
   * Creates review document for particular assignment
   *
   * List of requirements COPYING to review for cases
   * when list of requirements will be changed after review
   * and need to know for what user actually votes
   *
   */
  var review = {
    assignment: assignment,
    results: [],
    createdAt: new Date(),
  };

  Requirements.find({assignment: assignment}).forEach(function (req) {
    review.results.push(req);
  });

  return review;
}

/* Header template */
Template.assignment_make_review_header.helpers({
  'work': function () {
    return WorkForReview.findOne();
  },
  'assignment': function () {
    return ProjectAssignments.findOne({_id: Router.current().params._id});
  }
});

/* Content template */
Template.make_review_content.onCreated(function () {
  var self = this;

  /* Client side collection for reviews */
  self.reviews = new Meteor.Collection(null);
  self.assignment = Router.current().params._id;
  // reactive variable to change current work for review
  self.reviewCounter = new ReactiveVar(null);
  self.reviewCounter.set(0);

  self.currentReview = new ReactiveVar(null);
  self.reviewObject = new ReactiveVar(null);

  self.autorun(function() {
    self.subscribe('work-review-next', self.assignment, self.reviewCounter.get(), function () {
      var review = prepareNewReview(self.assignment);
      self.currentReview.set(review);
    });
  });
});

Template.make_review_content.helpers({
  'work': function () {
    return WorkForReview.findOne();
  },
  'assignment': function () {
    return ProjectAssignments.findOne({_id: Template.instance().assignment});
  },
  'review': function () {
    return Template.instance().currentReview.get();
  }
});

Template.make_review_content.events({
  'submit .check-list': function (event, template) {
    event.preventDefault();
    // Check if all selected
    // if (!lodash(this.requirements).every('result')) {
    //   alert('Please make a choice for every requirement');
    //   return false;
    // };

    warnkWorkForReviewCollection();
    var review = Template.instance().currentReview.get();
    review.work = WorkForReview.findOne()._id;
    review.feedback = event.target.feedback.value;
    review.totalScore = lodash.reduce(review.results, function(total, req) {
      return total + (req.result ? req.result.value || 0 : 0) * req.score;
    }, 0);
    console.log('Review completed: ', review);

    // Save to database
    Reviews.insert(review, function(error, result) {
      if (result) {
        // todo: show thanks message
        console.info('Review saved: ', result);
        template.find("form").reset();
        template.reviewCounter.set(template.reviewCounter.get() + 1);
      };
      if (error) { console.log('Error: ', error) };
    });
  }
});


/* Button to check requirement */

Template.registerHelper('getMark', function(req) {
  return req === 0 ? 'no' : (req === 1? 'yes' : '')
});

Template.check_requirement.onCreated(function () {
  var self = this;
  self.state = new ReactiveVar;
  self.getResult = () => Template.currentData().requirement.result;
  self.autorun(function() {
    self.state.set(self.getResult() ? self.getResult().value : null)
  });
});

Template.check_requirement.helpers({
  checkResult: function() {
    return Template.instance().state.get();
  }
});

Template.check_requirement.events({
  'click .check-switcher .yes': function (event, template) {
    this.requirement.result = this.requirement.result || {};
    this.requirement.result.value = 1;
    template.state.set( 1 );
  },
  'click .check-switcher .no': function (event, template) {
    this.requirement.result = this.requirement.result || {};
    this.requirement.result.value = 0;
    template.state.set( 0 );
  }
});

/* Requirement comment field */

Template.requirement_comment.onCreated(function () {
  this.commentDep = new Tracker.Dependency;
});

Template.requirement_comment.helpers({
  'stateClass': function () {
    Template.instance().commentDep.depend();
    var result = Template.instance().data.requirement.result;
    if (result && result.comment && result.comment.length) {
      console.log(result.comment);
      return 'completed';
    }
    return '';
  }
});

Template.requirement_comment.events({
  'click .reset-button': function (event, template) {
    template.find('#feedback').value = '';
    this.requirement.result.comment = undefined;
    template.commentDep.changed();
  },
  'keyup #feedback': function(event, template) {
    this.requirement.result = this.requirement.result || {};
    this.requirement.result.comment = event.currentTarget.value;
    template.commentDep.changed();
  }
})