const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

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
  if (inIframe() === true) {
    new Postmate.Model({
      LOAD_USER_INFO: data => loadUserInfo(data.token, data.userId),
    })
      .then((_containerHandler) => { window.containerHandler = _containerHandler; });
  }
};

