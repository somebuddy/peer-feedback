/*global lodash, Reviews, Router, WorkForReview, Assignments, Requirements */

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
    return Assignments.findOne({_id: Template.instance().assignment});
  },
  'review': function () {
    return Template.instance().currentReview.get();
  },
  reviewScore: function () {
    var review = Template.instance().currentReview.get();
    var score = {};
    score.total = lodash.reduce(review.results, function(total, req) {
      return total + req.score;
    }, 0);
    score.result = lodash.reduce(review.results, function(total, req) {
      return total + (req.result ? req.result.value || 0 : 0) * req.score;
    }, 0);
    score.checked = lodash.filter(review.results, function(r) {
      return r && r.result && r.result.value !== undefined;
    }).length;
    score.count = review.results.length;
    console.log(score);
    return score;
  }
});

Template.make_review_content.events({
  'submit .check-list': function (event, template) {
    event.preventDefault();
    // Check if all selected
    if (!lodash(this.requirements).every('result')) {
      alert('Please make a choice for every requirement');
      return false;
    };

    warnkWorkForReviewCollection();
    var review = Template.instance().currentReview.get();
    review.work = WorkForReview.findOne()._id;
    review.feedback = event.target.feedback.value;
    review.totalScore = lodash.reduce(review.results, function(total, req) {
      return total + (req.result ? req.result.value || 0 : 0) * req.score;
    }, 0);
    console.log('Review completed: ', review);

    // Save to database
    Meteor.call('addReview', review, function(error, result) {
      console.log(error, result);
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
    console.log(Template.instance());
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
      return 'completed';
    }
    return '';
  }
});

Template.requirement_comment.events({
  'click .comment-button': function(event, template) {
    $(event.target).toggleClass('edit');
    $(template.find('.comment-field')).toggleClass('opened');
  },
  'click .reset-button': function (event, template) {
    template.find('#feedback').value = '';
    this.requirement.result.comment = undefined;
    template.commentDep.changed();
  },
  'keyup #comment': function(event, template) {
    this.requirement.result = this.requirement.result || {};
    this.requirement.result.comment = event.currentTarget.value;
    template.commentDep.changed();
  }
})