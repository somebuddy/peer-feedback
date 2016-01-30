/*global Router, ProjectAssignments */

Router.configure({
  layoutTemplate: 'page'
});

Router.route('/', function() {
  this.render('navbar', { to: 'navbar' });
  this.render('assignments_header', { to: 'header' });
  this.render('assignments_list', { to: 'content' });
});

Router.route('/assignment/:_id', function() {
  this.render('navbar', { to: 'navbar' });
  this.render('assignment_details_header', { 
    to: 'header',
    data: function () {
      return ProjectAssignments.findOne({_id:this.params._id});
    }
  });
  this.render('requirements_list', { 
    to: 'content',
    data: function () {
      return Requirements.find({assignment:this.params._id});
    }
  });
});

Router.route('/reviews', function() {
  this.render('navbar', { to: 'navbar' });
  this.render('reviews_header', { to: 'header' });
  this.render('assignments_list', { to: 'content' });
});