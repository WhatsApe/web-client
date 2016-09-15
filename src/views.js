(function() {

  var contactUser;

  $(document).ready(function() {

    $( "ul" ).on('click', 'li > .about > .name', function(event) {
      contactUser = event.target.innerHTML;
      var status = event.target.nextSibling.innerText;

      render();

    });

  });

  var render = function() {
    ChatObj.currentContact = contactUser;

    imageFromStorage(contactUser);


    $('.chat-with').text(ChatObj.currentContact);

    $('.chat-num-messages').text(status);

    $( "#chat-list" ).hide( "slow", function() {});

    $( "#chat-details" ).show( "slow", function() {
      $("#chat-details > ul").not('#' + $('.chat-with').text()).hide();
      $('ul#' + $('.chat-with').text()).show();
    });

    $( "#chat-message-box-replacer" ).hide( "slow", function() {});
    $( "#chat-message-box" ).show( "slow", function() {});
  }

  function imageFromStorage(key) {
    var picture = localStorage.getItem(key);
    var image = document.createElement('img');
    var header = document.getElementById('header-profile-image').src = picture;
  }


})();
