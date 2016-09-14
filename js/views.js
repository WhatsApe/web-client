
$(document).ready(function(){

  $( "#chat-details" ).hide();
  $( "#chat-message-box" ).hide();

  $( ".message-listed" ).click(function() {
    $( "#chat-list" ).hide( "slow", function() {
      // Animation complete.
    });
    $( "#chat-details" ).show( "slow", function() {
      // Animation complete.
    });
    $( "#chat-message-box-replacer" ).hide( "slow", function() {
      // Animation complete.
    });
    $( "#chat-message-box" ).show( "slow", function() {
      // Animation complete.
    });
  });

  messageView();

});

var messageView = function() {

  var contactUser;

  $( "ul" ).on('click', 'li > .about > .name', function(event) {
    contactUser = event.target.innerHTML;
    var status = event.target.nextSibling.innerText;

    render();

  });

  $('#message-to-send').on('keypress', function(ev) {

    if (ev.which === 13) {
      ev.preventDefault();
      var messageBody = $(this).val();

      var message = $msg({to: contactUser,
                          "type": "chat"})
          .c('body').t(messageBody).up()
          .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});

      console.log(message);

      ChatObj.connection.send(message);

    } else {

    }

  });

  var render = function() {
    ChatObj.currentContact = contactUser.substring(0, contactUser.indexOf('@'));
    $('.chat-with').text(ChatObj.currentContact);

    $('.chat-num-messages').text(status);


    $( "#chat-list" ).hide( "slow", function() {
      // Animation complete.
    });
    $( "#chat-details" ).show( "slow", function() {
      // Animation complete.
      $("#chat-details > ul").not('#' + $('.chat-with').text()).hide();
      $('ul#' + $('.chat-with').text()).show();
    });
    $( "#chat-message-box-replacer" ).hide( "slow", function() {
      // Animation complete.
    });
    $( "#chat-message-box" ).show( "slow", function() {
      // Animation complete.
    });
  }

}
