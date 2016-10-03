window.onload = function () {

  var isInIframe = window.frameElement && window.frameElement.nodeName == "IFRAME";

  $('#loginForm').submit(function (event) {
    event.preventDefault();
    var formData = $(this).serialize();

    $.post('/auth/login', formData)
      .done(function (response) {
        console.log(response);

        // Widget loaded as iframe
        // We honor the 'contract'
        if (isInIframe) {
          console.log('Inside iframe');
          window.parent.postMessage({ token: response.token }, 'https://spu.herokuapp.com');
        } else {
          console.log('Main window');
          $('#messageSpace').html(response.token);
        };

      })
      .fail(function (response) {
        console.log('Login failed');
        $('#messageSpace').html(response.responseText);
      });

  });

}
