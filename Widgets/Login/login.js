window.onload = function () {

  var inIframe = function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  var isInIframe = inIframe();

  $('#loginForm').submit(function (event) {
    event.preventDefault();
    var formData = $(this).serialize();

    $.post('https://spu.herokuapp.com/auth/login', formData)
      .done(function (response) {
        console.log(response);

        // Widget loaded as iframe
        // We honor the 'contract'
        if (isInIframe) {
          console.log('Inside iframe');
          window.parent.postMessage({ token: response.token }, 'https://containerspu.surge.sh');
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
