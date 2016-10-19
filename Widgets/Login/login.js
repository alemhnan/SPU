const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

window.onload = () => {
  if (inIframe() === true) {
    new Postmate.Model()
      .then((_containerHandler) => { window.containerHandler = _containerHandler; });
  }

  $('#loginForm').submit(function sumbitLoginForm(event) {
    event.preventDefault();
    const formData = $(this).serialize();

    $.post('https://spu.herokuapp.com/auth/login', formData)
      .done((response) => {
        $('input[type="submit"]').attr('disabled', 'true');

        if (window.containerHandler) {
          window.containerHandler.emit('LOGGED', { token: response.token });
        } else {
          $('#messageSpace').html(response.token);
        }
      })
      .fail((response) => {
        $('#messageSpace').html(response.responseText);
      });
  });
};

