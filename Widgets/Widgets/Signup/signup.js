const init = () => {
  if (SPU.inIframe() === true) {
    let containerHandler;
    const loadWidget = (allowedOrigins) => {
      const w = {
        actions: {},
        events: {
          SIGNEDUP: {},
        },
        allowedOrigins,
      };

      return new SPU.Widget(w)
        .then((_containerHandler) => { containerHandler = _containerHandler; });
    };

    $.ajax({
      url: 'https://spu.herokuapp.com/auth/allowedDomains',
      async: false,
      success: loadWidget,
    });

    $('#signupForm').submit(function sumbitSignupForm(event) {
      event.preventDefault();
      const formData = $(this).serialize();

      $.post('https://spu.herokuapp.com/auth/signup', formData)
        .done((response) => {
          if (containerHandler) {
            containerHandler.emit('SIGNEDUP', { user: response.user });
          } else {
            $('#messageSpace').html(response.user);
          }
        })
        .fail((response) => {
          $('#messageSpace').html(response.responseText);
        });
    });
  }
};


document.addEventListener('DOMContentLoaded', init);
