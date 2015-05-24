

  // Meteor.startup(function () {
  //   // code to run on server at startup
  // });


  Meteor.publish('events', function () {
    return Events.find();
  });

  Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'banned': 1, 'roles': 1}});
  });


Accounts.onCreateUser(function(options, user) {
    //pass the surname in the options
    if (!Meteor.users.find().count()) {
      user.roles = ['admin'];
    }
    if (!user.profile) {
      user.profile = {};
    }
    user.banned = false;
    return user
})
