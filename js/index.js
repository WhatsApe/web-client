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
