const getParameterByName = (_name, _url) => {
  const url = _url || window.location.href;
  const name = _name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

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

const init = () => {
  const getManifest = getParameterByName('getManifest') === 'true';
  if (SPU.inIframe() === true || getManifest === true) {
    const actions = {
      ENABLE_WRITE: data => enableWrite(data.token, data.userId),
    };

    const loadWidget = (allowedOrigins) => {
      new SPU.Widget({
        actions,
        events: {
          WROTE: {},
        },
        allowedOrigins,
        onlyManifest: getManifest,
      })
        .then((_containerHandler) => {
          containerHandler = _containerHandler;
          if (getManifest === true) {
            document.open('application/json', 'replace');
            document.write(JSON.stringify(containerHandler.manifest));
            document.close();
          }
        });
    };

    $.ajax({
      url: 'https://spu.herokuapp.com/auth/allowedDomains',
      async: false,
      success: loadWidget,
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
