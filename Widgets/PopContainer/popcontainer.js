/* eslint-disable no-underscore-dangle, no-param-reassign */
window.onload = () => {
  // Init login widget
  let loginWidgetHandler;
  const handShakeLoginWidget = new Postmate({
    container: document.getElementById('loginFrameDiv'),
    url: 'https://loginspu.surge.sh/index.html',
  })
    .then((_loginWidgetHandler) => { loginWidgetHandler = _loginWidgetHandler; });
  // End init login widget

  $('#signupButton').click(() => {
    const popUpWindow = window.open('', 'Signup', 'height=350,width=450');
    const newDiv = popUpWindow.document.createElement('div');
    newDiv.id = 'signupFrameDiv';
    popUpWindow.document.body.appendChild(newDiv);
    // Init signup widget
    // const handShakeSignupWidget =
    new Postmate({
      container: popUpWindow.document.getElementById('signupFrameDiv'),
      url: 'https://signupspu.surge.sh/index.html',
    })
      .then((signupWidgetHandler) => {
        signupWidgetHandler.frame.style.height = `${300}px`;
        signupWidgetHandler.frame.style.width = `${400}px`;
        // Flow 2
        signupWidgetHandler.on('SIGNEDUP', (data) => {
          const html = `<p>${data.user._id}</p> </br> <p>${data.user.name}</p>`;
          window.$('#messageSpace').html(html);
          window.console.log(html);
        });
      });
    // End signup login widget
  });

  Promise.all([handShakeLoginWidget])
    .then(() => {
      loginWidgetHandler.frame.style.height = `${300}px`;
      loginWidgetHandler.frame.style.width = `${400}px`;

      // Flow 1
      loginWidgetHandler.on('LOGGED', (data) => {
        const tokenDecoded = jwt_decode(data.token);
        const html = `<p>${tokenDecoded.userId}</p> </br> <p>${data.email}</p>`;
        window.$('#messageSpace').html(html);
      });
    });
};
