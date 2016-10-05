window.onload = function () {

	function receiveMessage(e) {
		// Check to make sure that this message came from the correct domain.
		if (e.origin !== "https://containerspu.surge.sh")
			return;

    var token = e.data.token;

    if (!token) {
      $('#messageSpace').html('Token not provided');
      return;
    }

    $.get('https://spu.herokuapp.com/auth/private?token=' + token)
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
