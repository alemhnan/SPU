let containerHandler;

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
      .done(() => containerHandler.emit('WROTE'))
      .fail((response) => {
        $('#messageSpace').html(response.responseText);
      });
  });
};

window.onload = () => {
  if (SPU.inIframe() === true) {
    const model = {
      ENABLE_WRITE: data => enableWrite(data.token, data.userId),
    };

    new SPU.Widget({
      widgetWindow: window,
      allowedOrigins: ['https://containerspu.surge.sh'],
      model,
    })
      .then((_containerHandler) => { containerHandler = _containerHandler; });
  }
};
