const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

const enableWrite = (token, userId) => {
  if (!token) {
    $('#messageSpace').html('Token not provided');
    return;
  }

  if (!userId) {
    $('#messageSpace').html('UserId not provided');
    return;
  }

  $('input[type="submit"]').removeAttr('disabled');
  $('#writeForm').submit(function submitWriteForm(event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.post(`https://readwritespu.herokuapp.com/userinfo/${userId}?token=${token}`, formData)
      .done(() => window.containerHandler.emit('WROTE'))
      .fail((response) => {
        $('#messageSpace').html(response.responseText);
      });
  });
};

window.onload = () => {
  if (inIframe() === true) {
    new Postmate.Model({
      ENABLE_WRITE: data => enableWrite(data.token, data.userId),
    })
      .then((_containerHandler) => { window.containerHandler = _containerHandler; });
  }
};
