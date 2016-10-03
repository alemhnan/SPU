window.onload = function () {

  // var isInIframe = window.frameElement && window.frameElement.nodeName == "IFRAME";

	function receiveMessage(e) {
		// Check to make sure that this message came from the correct domain.
		if (e.origin !== "https://spu.herokuapp.com")
			return;

    var token = e.data.token;

    if (!token) {
      $('#messageSpace').html('Token not provided');
      return;
    }

    $.get('/auth/private?token=' + token)
      .done(function (data) {
        $('#messageSpace').html(JSON.stringify(data));
        console.log(data);
      })
      .fail(function (response) {
        console.log('Login failed');
        $('#messageSpace').html(response.responseText);
      });    

  }

	window.addEventListener('message', receiveMessage);

}
