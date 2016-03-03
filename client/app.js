/*global moment, Router */

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