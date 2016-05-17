Template.navbar.events({
  'click .collapse-button': function (event, template) {
    event.currentTarget.classList.toggle('expand');
  }
});