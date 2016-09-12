var ChatObj = {
  connection: null,

  jid_to_id: function(jid) {
    return Strophe.getBareJidFromJid(jid)
        .replace(/@/g, "-")
        .replace(/\./g, "-");
  },

  on_roster: function(iq) {
    $(iq).find('item').each(function() {
      var jid = $(this).attr('jid');
      var name = $(this).attr('name') || jid;

      var jid_id = ChatObj.jid_to_id(jid);

      var contact = $('<li class="clearfix" id="' + jid_id + '">' +
                      '<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg" alt="avatar" />' +
                      '<div class="about">' +
                      '<div class="name">' + name + '</div>' +
                      '<div class="status">' +
                      '<i class="fa fa-circle offline"></i> offline' +
                      '<div class="roster-id hidden">' + jid +
                      '</div></div></div></li>');

      ChatObj.insert_contact(contact);
    });

    ChatObj.connection.addHandler(ChatObj.on_presence, null, "presence");
    ChatObj.connection.send($pres());
  },

  pending_subscriber: null,

  on_presence: function(presence) {
    var presence_type = $(presence).attr('type');
    var fr = $(presence).attr('from');
    var jid_id = ChatObj.jid_to_id(fr);

    if (presence_type === 'subscribe') {

    } else if (presence_type !== 'error') {
      //var contact = $('')
    }
  },

  on_roster_changed: function(iq) {

  },

  on_message: function(message) {

  },

  scroll_chat: function(jid_id) {

  },

  presence_value: function(element) {

  },

  insert_contact: function(element) {
    $('.list').append(element);
    searchFilter.init(); // Move to a better place
  }

};
