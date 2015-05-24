  Meteor.methods({
    addEvent: function(event) {
      var ev = Events.insert(event);
      return ev;
    },
    removeEvent: function(id) {
      Events.remove({_id: id})
    },
    updateFamInfo: function(info) {
      var res = Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.phone': info.phone,
                                                                    'profile.famName': info.name} })
      return res;
    }
  })
