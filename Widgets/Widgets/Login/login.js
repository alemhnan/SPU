let containerHandler;

window.onload = () => {
  if (inIframe(window) === true) {
    new Postmate.Model()
      .then((_containerHandler) => { containerHandler = _containerHandler; });
  }

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
};

