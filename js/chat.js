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
                      '<div class="about member">' +
                      '<div class="name">' + name + '</div>' +
                      '<div class="status">' +
                      '<i class="fa fa-circle offline"></i>' +
                      '<span class="presence"> offline </span>' +
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
    var from = $(presence).attr('from');
    var jid_id = ChatObj.jid_to_id(from);

    console.log(presence);
    console.log(from + ' : ' + presence_type);

    if (presence_type !== 'error') {
      var contact = $('.list li#' + jid_id + ' .fa-circle')
          .removeClass('online')
          .removeClass('away')
          .removeClass('offline')
      if (presence_type === 'unavailable') {
        contact.addClass('offline');
        contact.siblings('.presence').text('offline');
      } else {
        var show = $(presence).find('show').text();
        if (show === '' || show === 'chat') {
          contact.addClass('online');
          contact.siblings('.presence').text('online');
        } else {
          contact.addClass('away');
        }
      }

      var list = contact.parent().parent().parent();
      list.remove();
      ChatObj.insert_contact(list);
    }

    return true;
  },

  on_roster_changed: function(iq) {
    return true;
  },

  on_message: function(message) {
  },

  scroll_chat: function(jid_id) {

  },

  presence_value: function(element) {

  },

  insert_contact: function(element) {
    $('.list').append(element);
    messageView();
    searchFilter.init(); // Move to a better place
  }

};
