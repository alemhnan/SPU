const loadUserInfo = (token, userId) => {
  if (!token) {
    $('#messageSpace').html('Token not provided');
    return;
  }

  if (!userId) {
    $('#messageSpace').html('UserId not provided');
    return;
  }
  $.get(`https://readwritespu.herokuapp.com/userinfo/${userId}?token=${token}`)
    .done((data) => {
      let html = '';
      data.forEach((item) => {
        html += `<p><b>Type:</b> ${item.type}. <b>Value:</b> ${item.value}. <b>Random:</b> ${item.random}.<p>`;
      });
      $('#messageSpace').html(html);
    })
    .fail((response) => {
      $('#messageSpace').html(response.responseText);
    });
};

window.onload = () => {
  $('#messageSpace').html('<p>No info yet</p>');
  if (SPU.inIframe() === true) {
    const model = {
      LOAD_USER_INFO: data => loadUserInfo(data.token, data.userId),
    };
    new SPU.Widget({
      widgetWindow: window,
      allowedOrigins: ['https://containerspu.surge.sh'],
      model,
    })
      // .then((_containerHandler) => { containerHandler = _containerHandler; });
      .then(() => { });
  }
};

