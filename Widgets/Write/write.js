window.onload = function () {

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

    $('input[type="submit"]').removeAttr('disabled');

    $('#writeForm').submit(function (event) {
      event.preventDefault();
      var formData = $(this).serialize();
      $.post(`https://readwritespu.herokuapp.com/userinfo/${userId}?token=${token}`, formData)
        .done(function (data) {
          console.log(data);
          window.parent.postMessage({ status: 'POST_DONE' }, 'https://containerspu.surge.sh');
        })
        .fail(function (response) {
          console.log(response.responseText);
        });
    })
  }

  window.addEventListener('message', receiveMessage);





}