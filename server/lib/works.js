/*global Works, Assignments */

Meteor.methods({
  'submitWork': function (data) {
    if (!Meteor.user() && this.connection) throw new Meteor.Error("not-allowed", "Anonymous user detected", "You must sign in to submit works");
    data.user = Meteor.userId()

    // checking data
    if (!data) throw new Meteor.Error("empty-data", "Coudn't create work without any data");

    var assignment = Assignments.findOne({ _id: data.assignment })
    if (!assignment) throw new Meteor.Error("not-found", "Assignment is not found");

    if (!data.sourceUrl) new Meteor.Error("empty-data", "You must insert your work URL");

    return Works.insert(data);
  }
});