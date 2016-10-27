let containerHandler;

window.onload = () => {
  if (SPU.inIframe() === true) {
    new SPU.Widget({
      widgetWindow: window,
      allowedOrigins: [
        'https://containerspu.surge.sh',
        'https://popcontainerspu.surge.sh',
      ],
    })
      .then((_containerHandler) => { containerHandler = _containerHandler; });
  }

  $('#signupForm').submit(function sumbitSignupForm(event) {
    event.preventDefault();
    const formData = $(this).serialize();

    $.post('https://spu.herokuapp.com/auth/signup', formData)
      .done((response) => {
        // $('input[type="submit"]').attr('disabled', 'true');

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
};

