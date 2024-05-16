function animateGuestDialog() {
    
  var $messages = $('.messages-content'),
  d, h, m,
  i = 0;

  $(window).load(function() {
    $messages.mCustomScrollbar();
    setTimeout(function() {
      // fakeMessage();
    }, 100);
  });

  function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
  }

  function setDate() {
    d = new Date()
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
  }

  function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();
    setTimeout(function() {
      fakeMessage();
    }, 1000 + (Math.random() * 20) * 100);
  }

  $('.message-submit').click(function() {
    insertMessage();
  });

  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      insertMessage();
      return false;
    }
  })

  var Fake = [
    'Salut ca va?',
    'Sympa ta room',
    'Quoi de beau?',
    'Moi ca va merci',
    'Tu fais quoi?',
    'C\'est super',
    'Il fait beau à Lyon?',
    'Cool cool',
    'Pourquoi tu penses ça?',
    'Tu peux m\'expliquer?',
    'Bon du coup faut que j\'y aille',
  ]

  function fakeMessage() {
    if ($('.message-input').val() != '') {
      return false;
    }
    $('<div class="message loading new"><figure class="avatar"><img src="img/guestPlayer/guestPlayerRight.png" alt=""></figure><span></span></div>').appendTo($('.mCSB_container')).addClass('new');
    updateScrollbar();
  
    setTimeout(function() {
      $('.message.loading').remove();
      $('<div class="message new"><figure class="avatar"><img src="img/guestPlayer/guestPlayerRight.png" alt=""></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
      setDate();
      updateScrollbar();
      i++;
    }, 1000 + (Math.random() * 20) * 100);
  }

}