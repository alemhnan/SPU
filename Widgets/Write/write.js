window.onload = function () {

  var WIDGET_ID = 'W.Write'
  var isRegistered = false;

  var isInIframe = inIframe();

  if (isInIframe) {
    console.log(WIDGET_ID + 'is inside a iframe');
    window.parent.postMessage({ action: 'REGISTER', widgetId: WIDGET_ID }, '*');
  } else {
    console.log(WIDGET_ID + 'is in the main window');
    $('#messageSpace').html(response.token);
  };



  var containerOrigin = null;
  window.parent.postMessage({ status: 'POST_DONE' }, 'https://containerspu.surge.sh');


  function receiveMessage(e) {
    if (false === registered) {

    }
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


function widgetInit() {
  var isInIframe = inIframe();

  if (isInIframe) {
    console.log(WIDGET_ID + 'is inside a iframe');
    window.parent.postMessage({ action: 'REGISTER', widgetId: WIDGET_ID }, '*');
  } else {
    console.log(WIDGET_ID + 'is in the main window');
    $('#messageSpace').html(response.token);
  };
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}