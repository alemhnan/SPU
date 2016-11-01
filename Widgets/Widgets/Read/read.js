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

const init = () => {
  $('#messageSpace').html('<p>No info yet</p>');
  if (SPU.inIframe() === true) {
    const actions = {
      LOAD_USER_INFO: data => loadUserInfo(data.token, data.userId),
    };

    const loadWidget = allowedOrigins =>
      new SPU.Widget({
        actions,
        events: {},
        allowedOrigins,
      });
    // .then((_containerHandler) => { containerHandler = _containerHandler; });

    $.ajax({
      url: 'https://spu.herokuapp.com/auth/allowedDomains',
      async: false,
      success: loadWidget,
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
