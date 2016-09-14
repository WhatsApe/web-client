var ChatObj = {
  connection: null,
  currentUser: null,
  currentContact: null,
  currentStanza: null,

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



      var contact = $('<li class="clearfix contact" id="' + jid_id + '">' +
                      '<canvas id="' + jid_id + '-canvas" width="50" height="50"></canvas>' +
                      '<div class="about member">' +
                      '<div class="name">' + name + '</div>' +
                      '<div class="status">' +
                      '<i class="fa fa-circle offline"></i>' +
                      '<span class="presence"> offline </span>' +
                      '<div class="roster-id hidden">' + jid +
                      '</div></div></div></li>');

      ChatObj.insert_contact(contact, function() {
        ChatObj.get(function(stanza) {
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
            var type = $vCard.find('TYPE').text();
            var img_src = 'data:'+type+';base64,'+img;
            //display image using localStorage
            var ctx = $('#' + jid_id + '-canvas').get(0).getContext('2d');
            var img = new Image();   // Create new Image object
            img.onload = function(){
                // execute drawImage statements here
                ctx.drawImage(img,0,0)
            }
            img.src = img_src;
        },
                         name );
      });


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

  get: function(handler, jid){
    ChatObj.connection.vcard.get(handler, jid);
  },

  on_message: function(message) {
    var full_jid = $(message).attr('from');
    var jid = Strophe.getBareJidFromJid(full_jid);
    var jid_id = ChatObj.jid_to_id(jid);
    var body = $(message).find('body').text();

    ChatObj.currentContact = jid_id.substring(0, jid_id.indexOf('-'));

    if ($(message).find('composing').length > 0) {
      // Display alert that contact is composing
    } else if (body.length > 0) {

      // create a ul for the current contact and ol for chat history

      var chatHistory = $('.chat-history');
      var chatHistoryList = chatHistory.find('ul#' + ChatObj.currentContact);

      if (chatHistoryList.length === 0) {
        var ul = document.createElement('UL');
        ul.setAttribute('id', ChatObj.currentContact);
        document.getElementsByClassName('chat-history')[0].appendChild(ul);
        chatHistory = $('.chat-history');
        chatHistoryList = chatHistory.find('ul#' + ChatObj.currentContact);
      }

      var templateResponse = Handlebars.compile( $("#message-response-template").html());
      var contextResponse = {
        from: full_jid,
        response: body,
        time: chat.getCurrentTime()
      };

      chatHistoryList.append(templateResponse(contextResponse));

    }

    console.log(message);
    return true;
  },

  scroll_chat: function(jid_id) {

  },

  presence_value: function(element) {

  },

  insert_contact: function(element, callback) {
    $('.list').append(element);
    //messageView();
    searchFilter.init(); // Move to a better place

    if (callback) {
      callback();
    }
  }

};
