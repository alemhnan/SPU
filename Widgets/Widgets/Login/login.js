const init = () => {
  if (SPU.inIframe() === true) {
    let containerHandler;
    const loadWidget = allowedOrigins =>
      new SPU.Widget({
        actions: {},
        events: {
          LOGGED: {},
        },
        allowedOrigins,
      })
        .then((_containerHandler) => { containerHandler = _containerHandler; });

    $.ajax({
      url: 'https://spu.herokuapp.com/auth/allowedDomains',
      async: false,
      success: loadWidget,
    });

    $('#loginForm').submit(function sumbitLoginForm(event) {
      event.preventDefault();
      const formData = $(this).serialize();

      $.post('https://spu.herokuapp.com/auth/login', formData)
        .done((response) => {
          $('input[type="submit"]').attr('disabled', 'true');

          if (containerHandler) {
            containerHandler.emit('LOGGED', { token: response.token });
          } else {
            $('#messageSpace').html(response.token);
          }
        })
        .fail((response) => {
          $('#messageSpace').html(response.responseText);
        });
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
