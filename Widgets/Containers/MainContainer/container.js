/* eslint-disable no-underscore-dangle, no-param-reassign */
window.onload = () => {
  let token = null;
  let tokenDecoded = null;

  // Init login widget
  let loginWidgetHandler;
  const handShakeLoginWidget = new SPU.Container({
    widgetContainer: document.getElementById('loginFrameDiv'),
    url: 'https://loginspu.surge.sh/index.html',
  })
    .then((_loginWidgetHandler) => { loginWidgetHandler = _loginWidgetHandler; });
  // End init login widget

  // Init read widget
  let readWidgetHandler;
  const handShakeReadWidget = new SPU.Container({
    widgetContainer: document.getElementById('readFrameDiv'),
    url: 'https://readspu.surge.sh/index.html',
  })
    .then((_readWidgetHandler) => { readWidgetHandler = _readWidgetHandler; });
  // End read login widget

  // Init write widget
  let writeWidgetHandler;
  const handShakeWriteWidget = new SPU.Container({
    widgetContainer: document.getElementById('writeFrameDiv'),
    url: 'https://writespu.surge.sh/index.html',
  })
    .then((_writeWidgetHandler) => { writeWidgetHandler = _writeWidgetHandler; });
  // End write login widget

  $('#signupButton').click(() => {
    const popUpWindow = window.open('', 'Signup', 'height=350,width=450');
    const newDiv = popUpWindow.document.createElement('div');
    newDiv.id = 'signupFrameDiv';
    popUpWindow.document.body.appendChild(newDiv);

    // Init signup widget
    new SPU.Container({
      widgetContainer: popUpWindow.document.getElementById('signupFrameDiv'),
      url: 'https://signupspu.surge.sh/index.html',
    })
      .then((signupWidgetHandler) => {
        signupWidgetHandler.widgetFrame.style.height = `${300}px`;
        signupWidgetHandler.widgetFrame.style.width = `${400}px`;
        // Flow 2
        signupWidgetHandler.on('SIGNEDUP', (data) => {
          const html = `<p>${data.user.name}</p><p>${data.user._id}</p>`;
          window.$('#messageSpace').html(html);
          window.console.log(html);
          popUpWindow.close();
        });
      });
    // End signup login widget
  });

  Promise.all([handShakeLoginWidget, handShakeReadWidget, handShakeWriteWidget])
    .then(() => {
      loginWidgetHandler.widgetFrame.style.height = `${250}px`;
      loginWidgetHandler.widgetFrame.style.width = `${350}px`;

      readWidgetHandler.widgetFrame.style.height = `${250}px`;
      readWidgetHandler.widgetFrame.style.width = `${350}px`;

      writeWidgetHandler.widgetFrame.style.height = `${250}px`;
      writeWidgetHandler.widgetFrame.style.width = `${350}px`;

      // Flow 1
      loginWidgetHandler.on('LOGGED', (data) => {
        tokenDecoded = jwt_decode(data.token);
        token = data.token;
        readWidgetHandler.call('LOAD_USER_INFO', { token: data.token, userId: tokenDecoded.userId });
        writeWidgetHandler.call('ENABLE_WRITE', { token: data.token, userId: tokenDecoded.userId });
      });

      // Flow 2
      writeWidgetHandler.on('WROTE', () =>
        readWidgetHandler.call('LOAD_USER_INFO', { token, userId: tokenDecoded.userId }));
    });
};
