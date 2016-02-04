/*global Works, lodash, Requirements */

Meteor.publish('work-review-next', function(assignment, currentWork) {
  console.log(this.connection.httpHeaders['x-forwarded-for']);

  var works = Works.find({
    assignment: assignment
  }, {
    _id: { $ne: currentWork },
    fields: {_id:1}
  }).fetch();

  var selectedWork = lodash.sample(works);
  var work_id = selectedWork ? selectedWork._id : null;

  Mongo.Collection._publishCursor(Works.find({
    _id: work_id
  }), this, 'work-review-next');

  console.log('Now reviewed: ', work_id);

  this.ready();
});

Meteor.publish('requirements', function(assignment) {
  return Requirements.find({assignment: assignment});
});