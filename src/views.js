(function() {

  var contactUser;

  $(document).ready(function() {

    $('#chat-details').hide();
    $('#chat-message-box').hide();

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
      var contact = $('.chat-with').text();

      $("#chat-details > ul").not('#' + contact).hide();

      $('ul#' + contact).show();

      noMessages(contact);

    });

    $( "#chat-message-box-replacer" ).hide( "slow", function() {});
    $( "#chat-message-box" ).show( "slow", function() {});
  }

  function imageFromStorage(key) {
    var picture = localStorage.getItem(key);
    var image = document.createElement('img');

    if (picture) {
      document.getElementById('header-profile-image').src = picture;
    } else {
      document.getElementById('header-profile-image').src = 'images/jabby-70x85.png';
    }
  }

  window.imageFromStorage = imageFromStorage;

})();
