(function(){

  var chatHistory = $('.chat-history');
  var textarea = $('#message-to-send');
  var button = $('#send-btn');
  var messageToSend = '';

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
        var firstName = capitalize_Words(name.split('@')[0]);
        var jid_id = ChatObj.jid_to_id(jid);

        var contact = $('<li class="clearfix contact" id="' + jid_id + '">' +
                        '<canvas id="' + firstName + '-canvas" width="55" height="55"></canvas>' +
                        '<div class="about member">' +
                        '<div class="name">' + firstName + '</div>' +
                        '<div class="status">' +
                        '<i class="fa fa-circle offline"></i>' +
                        '<span class="presence"> offline </span>' +
                        '<div class="roster-id hidden">' + jid +
                        '</div></div></div></li>');

        createContactView(firstName);

        ChatObj.insert_contact(contact, function() {
          ChatObj.get(function(stanza) {
              var $vCard = $(stanza).find("vCard");
              var img = $vCard.find('BINVAL').text();

              var type = $vCard.find('TYPE').text();
              var img_src = 'data:'+type+';base64,'+img;

              var ctx = $('#' + firstName + '-canvas').get(0).getContext('2d');
              ctx.scale(0.60,0.60);

              var img = new Image();
              img.onload = function(){
                  ctx.drawImage(img,0,0);
                  var canvas = document.getElementById(firstName + '-canvas');
                  var imgAsDataURL = canvas.toDataURL("image/png")
                  localStorage.setItem(firstName, imgAsDataURL);
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

    on_send: function(body) {
      var message = $msg({to: (ChatObj.currentContact + '@localhost').toLowerCase(),
                          "type": "chat"})
          .c('body').t(body).up()
          .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});

      ChatObj.connection.send(message);
    },

    on_message: function(message) {
      var full_jid = $(message).attr('from');
      var jid = Strophe.getBareJidFromJid(full_jid);
      var jid_id = ChatObj.jid_to_id(jid);
      var body = $(message).find('body').text();

      ChatObj.currentContact = capitalize_Words(jid_id.substring(0, jid_id.indexOf('-')));

      if ($(message).find('composing').length > 0) {
        $('ul#' + ChatObj.currentContact).append(
                "<li class='typing'>" +
                Strophe.getNodeFromJid(jid) +
                " is typing...</li>");

        scrollToBottom();
      } else if (body.length > 0) {
          render('received', full_jid, body);
      }

      console.log(message);

      if ($(message).find('paused').length > 0) {
          $('ul#' + ChatObj.currentContact + ' > li.typing').remove();
      }

      return true;
    },

    presence_value: function(element) {

    },

    insert_contact: function(element, callback) {
      $('.list').append(element);
      searchFilter.init(); // Move to a better place
      if (callback) {
        callback();
      }
    }
  };

  var bindEvents = function() {
    //button.on('click', addMessage);
    textarea.on('keyup', addMessageEnter);
  }

  var addMessage = function() {
    var message = $('#message-to-send').val();
    render(null, ChatObj.currentUser, message);
    $('#message-to-send').val('');
    ChatObj.on_send(message);
  }

  var addMessageEnter = function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        addMessage();
      }
  }

  var cleanupText = function(string) {
    return capitalize_Words(string.split('@')[0]);
  }

  var capitalize = function(string) {
    return string;
  }

  var scrollToBottom = function() {
    chatHistory.scrollTop(chatHistory[0].scrollHeight);
  }

  var getCurrentTime = function() {
    return new Date().toLocaleTimeString().
            replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
  }

  function capitalize_Words(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  var createContactView = function(contact) {
    var ul = document.createElement('UL');
    ul.setAttribute('id', contact);
    document.getElementsByClassName('chat-history')[0].appendChild(ul);
    var chatHistory = $('.chat-history');
    return chatHistoryList = chatHistory.find('ul#' + contact);
  }


  var render = function(messageType, msgFrom, body, time) {
    var templateResponse;
    var msgFrom = capitalize_Words(msgFrom.split('@')[0]);
    var currentContact = cleanupText(ChatObj.currentContact);

    var chatHistoryList = chatHistory.find('ul#' + currentContact);

    if (chatHistoryList.length === 0) {
      chatHistoryList = createContactView(currentContact);
    }

    if (messageType === 'received') {
      templateResponse = Handlebars.compile( $("#message-response-template").html());
    } else {
      templateResponse = Handlebars.compile( $("#message-template").html());
    }

    var contextResponse = {
      from: msgFrom,
      response: body,
      time: getCurrentTime()
    };

    chatHistoryList.append(templateResponse(contextResponse));
    scrollToBottom();
  }

  function storeImage(id, itemName) {
    var canvas = document.getElementById(id + '-canvas');

    var dataURL = canvas.toDataURL('image/png').slice(22);

    localStorage.setItem(itemName, dataURL);
  }

  bindEvents();
  window.ChatObj = ChatObj;

})();
