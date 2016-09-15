$(document).ready(function() {
    $('.login').submit(function(event) {
      event.preventDefault();

      $(document).trigger('connect', {
        jid: $('#username').val().toLowerCase() + '@localhost',
        password: $('#password').val()
      });

    });

    $('#disconnect').click(function() {
      ChatObj.connection.disconnect();
      ChatObj.connection = null;
      $('#disconnect').hide();
    });

    $(document).bind('connect', function(ev, data) {
      var conn = new Strophe.Connection(
          'http://31.3.250.10:5280/http-bind');

      conn.connect(data.jid, data.password, function(status) {
        if(status === Strophe.Status.CONNECTED) {
          $(document).trigger('connected');
          ChatObj.currentUser = data.jid;
          $('.chat-with').text('Welcome '+ cleanupText(ChatObj.currentUser));

        } else if (status === Strophe.Status.DISCONNECTED) {
          $(document).trigger('disconnected');
        } else if (status === Strophe.Status.AUTHFAIL) {
          alert('Sorry Authentication Failed.');
        }
      });
      ChatObj.connection = conn;
    });

    $(document).bind('connected', function() {
      $('#disconnect').show();

      var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});

      ChatObj.connection.sendIQ(iq, ChatObj.on_roster);

      ChatObj.connection.addHandler(ChatObj.on_roster_changed,
                                  "jabber:iq:roster", "iq", "set");

      ChatObj.connection.addHandler(ChatObj.on_message,
                                  null, "message", "chat");

    });

});


$(window).unload(function() {
  ChatObj.connection.sync = true;
  var msg = $pres({
    to: settings.room,
    type: 'unavailable'
  });
  ChatObj.connection.send(msg);
  ChatObj.connection.flush();
  ChatObj.connection.disconnect();
});
