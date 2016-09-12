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
