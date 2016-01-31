/*global Router, ProjectAssignments, Requirements, Works */

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
  this.render('submit_work', {
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

Router.route('/make-review/:_id', function() {
  var review = {
    works: Works.find({assignment:this.params._id}).fetch(),
    assignment: ProjectAssignments.findOne({_id:this.params._id}),
    requirements: Requirements.find({assignment:this.params._id}).fetch()
  };

  console.log(review.works);

  this.render('navbar', { to: 'navbar' });
  this.render('assignment_make_review_header', {
    to: 'header',
    data: function () {
      return ProjectAssignments.findOne({_id:this.params._id});
    }
  });
  this.render('review_checklist', {
    to: 'content',
    data: function () {
      return review;
    }
  });
});