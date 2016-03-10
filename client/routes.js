/*global Router, Assignments, Requirements, Works */

Router.configure({
  layoutTemplate: 'page'
});

Router.route('/', function() {
  Router.go('/assignments');
});

Router.route('/assignments', {
  waitOn: function () {
    return [
      Meteor.subscribe('assignmentList'),
    ];
  },
  yieldRegions: {
    'navbar': { to: 'navbar' },
    'assignments_header': {to: 'header'},
    'assignments_list': {to: 'content'}
  },
  action: function () {
    this.render();
  }
});

Router.route('/assignments/:_id', {
  waitOn: function () {
    return [
      Meteor.subscribe('assignment', this.params._id),
      Meteor.subscribe('requirements', this.params._id)
    ];
  },
  yieldRegions: {
    'navbar': { to: 'navbar' },
  },
  action: function() {
    this.render('assignment_details_header', {
      to: 'header',
      data: function () {
        return Assignments.findOne({_id:this.params._id});
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
        return Assignments.findOne({_id:this.params._id});
      }
    })
  }
});

Router.route('/reviews', function() {
  this.render('navbar', { to: 'navbar' });
  this.render('reviews_header', { to: 'header' });
  this.render('assignments_list', { to: 'content' });
});

Router.route('/reviews/:_id', function() {
  this.subscribe('assignment', this.params._id);
  this.render('navbar', { to: 'navbar' });
  this.render('assignment_details_header', {
    to: 'header',
    data: function () {
      return Assignments.findOne({_id:this.params._id});
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
    return [
      Meteor.subscribe('assignment', this.params._id),
      Meteor.subscribe('requirements', this.params._id)
    ];
  },
  action: function() {
    // selecting random work
    this.render('navbar', { to: 'navbar' });
    this.render('assignment_make_review_header', { to: 'header' });
    this.render('make_review_content', { to: 'content' });
  }
});

Router.route('/work/:id/summary', {
  subscriptions: function() {
    return [
      Meteor.subscribe('user-work', this.params.id),
      Meteor.subscribe('work-reviews', this.params.id)
    ];
  },
  action: function () {
    this.render('navbar', { to: 'navbar' });
    this.render('work_summary_header', {
      to: 'header',
      data: function () {
        var work = Works.findOne({_id: this.params.id});
        var assignment_id = work ? work.assignment : null;
        Meteor.subscribe('assignment', assignment_id);
        return Assignments.findOne({_id: assignment_id});
      }
    });
    this.render('work_summary_content', {
      to: 'content',
      data: function () {
        var work = Works.findOne({_id: this.params.id});
        var assignment_id = work ? work.assignment : null;
        Meteor.subscribe('assignment', assignment_id);
        Meteor.subscribe('requirements', assignment_id);
        return work;
      }
    });
  }
})