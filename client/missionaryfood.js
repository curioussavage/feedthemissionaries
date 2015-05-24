Meteor.subscribe('userData')

  Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL',
   // extraSignupFields: [{
   //        fieldName: 'phone',
   //        fieldLabel: 'phone number',
   //        inputType: 'text',
   //        visible: true,
   //        saveToProfile: true
   //    }]
  });
  Meteor.subscribe('events');

  Template.hello.helpers({
      options: function() {
          return {
            options: {
              selectable: true,
              selectHelper: true,
              selectConstraint: 'day',
              selectOverlap: false,
              select: function(start, end, allday) {
                // if (confirm('are you sure you want to schedule this day?')) {
                  var startDate = start.format();
                  var endDate = end.format();
                  var today = moment();
                  var user = Meteor.user();
                  var famName = user.profile.famName

                  if ( !(start > moment() ) ) {return;}
                  if (!user) {return}

                  var x = Events.find({start: start.format(), end: end.format()}).fetch()
                  if (x.length > 0) {return}

                  if (user.roles && user.roles.indexOf('admin') >= 0 && Session.get('adminMode') == true) {
                    famName = window.prompt('enter fam name')
                  }

                  var ev = {
                    title: famName,
                    user: user._id,
                    start: startDate,
                    end: endDate,
                    overlap: false,
                    allDay: true
                  }

                  Meteor.call('addEvent', ev, function(err, res) {
                    if (!err) {
                      console.log('event added')
                    }
                  }.bind(this))
                // }
              },
              eventClick: function(calEv, jsEv, view) {
                var user = Meteor.userId();
                if (calEv.user !== user) {return;}
                Meteor.call('removeEvent', calEv.id, function(err, res) {
                  console.log('deleted')
                })
              },
              events: function(start, end, whatisthis, callback) {
                var myEvents = Events.find();
                var events = myEvents.map(function(evt){
                  return {
                    title: evt.title,
                    user: evt.user,
                    id: evt._id,
                    start: evt.start,
                    end: evt.end,
                    allDay: evt.allDay,
                    overlap: evt.overlap,
                  }
                })
                callback(events);
              },
              id: 'myCal'
            }

          };
      }

  });

Template.loggedInMenu.helpers({
  profile: function() {
    if (Meteor.user()) {
      return Meteor.user().profile
    }
  },
  isAdminMode: function() {
    return Session.get('adminMode');
  },
  userIsAdmin: function() {
    var user = Meteor.user()
    if (user.roles) {
      return user.roles.indexOf('admin') >= 0;
    }
  }
})

Template.loggedInMenu.events({
  'click #change-info': function(e) {
    e.preventDefault();
    // $('#change-info').toggle();
    $('.fam-info-wrap').toggle();
  },
  'click #submit-fam-cancel': function(e) {
    e.preventDefault();
    // $('#change-info').toggle();
    $('.fam-info-wrap').toggle();

  },
  'submit .fam-info-form': function(e) {
    e.preventDefault();

    var name = $('#fam-name')[0].value;
    var phone = $('#fam-phone')[0].value;

    if (!phone && !name) {return}
    var info = {name: name, phone: phone}

    Meteor.call('updateFamInfo', info, function(err, res) {
      console.log(err)
      $('#fam-name')[0].value = '';
      $('#fam-phone')[0].value = '';

      $('#change-info').toggle();
      $('.fam-info-wrap').toggle();
    })
  }
})

//////////////  admin toggle template
Session.set('adminMode', false);

Template.adminToggle.events({
  'click .adminToggle': function(e) {
    if (Session.get('adminMode')) {
      Session.set('adminMode', false);
    } else {
      Session.set('adminMode', true);
    }
  }
})






