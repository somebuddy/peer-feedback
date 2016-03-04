/*global Assignments */

Meteor.publish('assignmentList', function() {
  return Assignments.find({});
});

Meteor.publish('assignment', function(id) {
  return Assignments.find({_id: id});
});

Meteor.methods({
  'addAssignment': function (data) {
    if (!Meteor.user() && this.connection) throw new Meteor.Error("not-allowed", "Anonymous user detected", "You must sign in to add websites");

    // checking data
    if (!data) throw new Meteor.Error("empty-data", "Coudn't create assignment without any data");
    if (!data.title) throw new Meteor.Error("empty-data", "Assignment must have name");

    return Assignments.insert(data);
  }
});