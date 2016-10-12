window.onload = function () {

  $('#messageSpace').html('<p>No info yet</p>');


  function receiveMessage(e) {
    // Check to make sure that this message came from the correct domain.
    if (e.origin !== "https://containerspu.surge.sh")
      return;

    var token = e.data.token;
    var userId = e.data.userId;

    if (!token) {
      $('#messageSpace').html('Token not provided');
      return;
    }

    if (!userId) {
      $('#messageSpace').html('UserId not provided');
      return;
    }

    $.get(`https://readwritespu.herokuapp.com/userinfo/${userId}?token=${token}`)
      .done(function (data) {
        var html = '';
        data.forEach(function (item, index) {
          html += `<p><b>Type:</b> ${item.type}. <b>Value:</b> ${item.value}. <b>Random:</b> ${item.random}.<p>`;
        });
        $('#messageSpace').html(html);
      })
      .fail(function (response) {
        console.log(response.responseText);
      });
  }

  window.addEventListener('message', receiveMessage);

}
