/*global Reviews, Works */

Meteor.publish('work-reviews', function(work) {
  return Reviews.find({
    work: work,
  });
});

Meteor.methods({
  'addReview': function (data) {
    if (!Meteor.user() && this.connection) throw new Meteor.Error("not-allowed", "Anonymous user detected", "You must sign in to make reviews");
    data.user = Meteor.userId()

    // checking data
    if (!data) throw new Meteor.Error("empty-data", "Coudn't send review without any data");

    var work = Works.findOne({ _id: data.work })
    if (!work) throw new Meteor.Error("not-found", "Work is not found");

    data.createdAt = new Date();
    return Reviews.insert(data);
  }
});