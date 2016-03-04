/*global Works, Reviews, lodash */


Template.submitted_works_list.events({
  'click .close-button': function (event) {
    $(event.currentTarget).closest('.modal-wrapper').removeClass('show');
  },
});

Template.submitted_works_list.helpers({
  'list': function() {
    var works = Works.find({assignment:this._id}).fetch();
    return works;
  },
  'workReviewResult': function (work) {
    var reviews = Reviews.find({work: work._id}).fetch();
    var score = lodash.reduce(reviews, function(t, rev) {
      var s = lodash.filter(rev.results, function(r) {
        return r.result == 2;
      });
      return t + (s.length || 0);
    }, 0);
    // TODO: reviews count
    // TODO: average score
    return {
      count: reviews.length,
      score: score,
      avg: Math.round(score / reviews.length, 2)
    };
  }
});

Template.submit_work.events({
  'click .close-button': function (event) {
    $(event.currentTarget).closest('.modal-wrapper').removeClass('show');
  },
  'submit form': function (event, template) {
    event.preventDefault();

    var work = {
      assignment: this._id,
      sourceUrl: event.target.source_url.value,
      previewUrl: event.target.preview_url.value,
      comments: event.target.comments.value,
    };

    var feedback = $(template.find('.feedback'));

    Meteor.call('submitWork', work, function(e, result) {
      if (e) {
        console.error(e);
        feedback.addClass('error');
        feedback.html(e.message + (e.details ? " (" + e.details + ")" : ""));
      } else {
        console.info('Result:', result);
        feedback.removeClass('error hint success');
        $(event.target).closest('.modal-wrapper').removeClass('show');
      }
    });
  },
  'click .modal-wrapper': function (event) {
    if ($(event.target).is($('.modal-wrapper'))) {
      $(event.target).removeClass('show');
    }
  },
});