
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
});

var messageView = function() {
  $( ".name" ).click(function(event) {

    var user = event.target.innerHTML;
    var status = event.target.nextSibling.innerText;

    $('.chat-with').text(user);
    $('.chat-num-messages').text(status);

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
}
