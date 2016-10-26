let containerHandler;

window.onload = () => {
  if (inIframe(window) === true) {
    new Postmate.Model()
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

