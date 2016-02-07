/*global Router, ProjectAssignments, Requirements, Works, lodash */

Router.configure({
  layoutTemplate: 'page'
});

Router.route('/', function() {
  Router.go('/assignments');
});

Router.route('/assignments', function() {
  this.render('navbar', { to: 'navbar' });
  this.render('assignments_header', { to: 'header' });
  this.render('assignments_list', { to: 'content' });
});

Router.route('/assignments/:_id', function() {
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
  this.render('submit_modals', {
    to: 'modal',
    data: function () {
      return ProjectAssignments.findOne({_id:this.params._id});
    }
  })
});

Router.route('/reviews', function() {
  this.render('navbar', { to: 'navbar' });
  this.render('reviews_header', { to: 'header' });
  this.render('assignments_list', { to: 'content' });
});

Router.route('/reviews/:_id', function() {
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

Router.route('/make-review/:_id', {
  subscriptions: function() {
    return Meteor.subscribe('requirements', this.params._id);
  },
  action: function() {
    // selecting random work
    this.render('navbar', { to: 'navbar' });
    this.render('assignment_make_review_header', { to: 'header' });
    this.render('make_review_content', { to: 'content' });
  }
});

Router.route('/work/:id/summary', {
  action: function () {
    this.render('navbar', { to: 'navbar' });
    this.render('work_sammary_header', { to: 'header' });
    this.render('work_summary_content', { to: 'content' });
  }
})