$(document).ready(function() {
    $('#login_dialog').dialog({
      autoOpen: true,
      draggable: false,
      modal: true,
      title: 'Connect to XMPP',
      buttons: {
          "Connect": function () {
              $(document).trigger('connect', {
                  jid: $('#jid').val().toLowerCase(),
                  password: $('#password').val()
              });

              $('#password').val('');
              $(this).dialog('close');
          }
      }
    });
});
