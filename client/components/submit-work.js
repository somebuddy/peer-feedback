function setFeedback(template, cls, text) {
  var fb = $(template.find('.feedback'));
  cls ? fb.addClass(cls) : fb.removeClass('error hint success');
  text ? fb.text(text) : fb.text("");
}

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

    Meteor.call('submitWork', work, function(e, result) {
      if (e) {
        setFeedback(template, 'error', e.message + (e.details ? " (" + e.details + ")" : ""));
      } else {
        setFeedback(template);
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