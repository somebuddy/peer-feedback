var isPublic = function (work) {
  return work && work.public;
};

var isAuthor = function (work) {
  return work && work.user === Meteor.userId();
}

Template.work_info.helpers({
  isAuthor: function () {
    return isAuthor(this.work);
  },
  isPublic: function () {
    return isPublic(this.work);
  },
  canMakePublic: function () {
    return isAuthor(this.work) && !isPublic(this.work);
  },
  canMakePrivate: function () {
    return isAuthor(this.work) && isPublic(this.work);
  }
});