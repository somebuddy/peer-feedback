/*global moment, Router */

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('llll');
});

Template.registerHelper('timeLeft', function(date) {
  return moment(date).fromNow();
});

Template.registerHelper('getUserName', function(id) {
  Meteor.subscribe('user-name', id);
  var user = Meteor.users.findOne({_id: id});
  return user && user.username ? user.username : 'anonymous user';
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