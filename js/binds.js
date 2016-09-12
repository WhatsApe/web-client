$(document).bind('connect', function(ev, data) {
  var conn = new Strophe.Connection(
      'http://31.3.250.10:5280/http-bind');

  conn.connect(data.jid, data.password, function(status) {
    if(status === Strophe.Status.CONNECTED) {
      $(document).trigger('connected');
      console.log(status);
    } else if (status === Strophe.Status.DISCONNECTED) {
      $(document).trigger('disconnected');
      console.log(status);
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

});
