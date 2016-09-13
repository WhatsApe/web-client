
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

  $( ".member" ).click(function() {
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
