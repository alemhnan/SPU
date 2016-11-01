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
    url: 'https://readwritespu.surge.sh/index.html',
  })
    .then((_writeWidgetHandler) => { writeWidgetHandler = _writeWidgetHandler; });
  // End write login widget

  Promise.all([handShakeLoginWidget, handShakeReadWidget, handShakeWriteWidget])
    .then(() => {
      loginWidgetHandler.widgetFrame.style.height = `${300}px`;
      loginWidgetHandler.widgetFrame.style.width = `${400}px`;

      readWidgetHandler.widgetFrame.style.height = `${300}px`;
      readWidgetHandler.widgetFrame.style.width = `${400}px`;

      writeWidgetHandler.widgetFrame.style.height = `${300}px`;
      writeWidgetHandler.widgetFrame.style.width = `${400}px`;

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
    })
    .catch((err) => {
      console.log(err);
    });
};
