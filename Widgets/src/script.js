const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const DEFAULT_PARAMS = /=[^,]+/mg;
const FAT_ARROWS = /=>.*$/mg;
const SPACES = /\s/mg;
const BEFORE_OPENING_PAREN = /^[^(]*\(/mg;
const AFTER_CLOSING_PAREN = /^([^)]*)\).*$/mg;

const getParameterNames = (fn) => {
  const code = fn.toString()
    .replace(SPACES, '')
    .replace(COMMENTS, '')
    .replace(FAT_ARROWS, '')
    .replace(DEFAULT_PARAMS, '')
    .replace(BEFORE_OPENING_PAREN, '')
    .replace(AFTER_CLOSING_PAREN, '$1');

  return code ? code.split(',') : [];
};

/**
 * The type of messages our frames our sending
 * @type {String}
 */
const MIME_TYPE = 'application/x-spu-v1+json';

/**
 * Check if we are in an iframe or not
 */
const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export { inIframe };

/**
 * Takes a URL and returns the origin
 * @param  {String} url The full URL being requested
 * @return {String}     The URLs origin
 */
const resolveOrigin = (url) => {
  const a = document.createElement('a');
  a.href = url;
  return a.origin || `${a.protocol}//${a.hostname}`;
};

/**
 * Ensures that a message is safe to interpret
 * @param  {Object} message       The message being sent
 * @param  {String} allowedOrigin The whitelisted origin
 * @return {Boolean}
 */
const sanitize = (message, allowedOrigin) => {
  if (message.origin !== allowedOrigin) return false;
  if (typeof message.data !== 'object') return false;

  // Mime type reserved
  if (message.data.mimeType !== MIME_TYPE) return false;

  // Type of message could be only one of the following
  if (!{ handshakeReply: 1, handshake: 1, emit: 1, call: 1 }[message.data.type]) return false;
  return true;
};

/**
 * Composes an API to be used by the container
 * @param {Object} info Information on the consumer
 */
class Container {

  constructor(args) {
    const { windowContainer, widgetContainer, url } = args;

    this.windowContainer = windowContainer || window;

    // http://stackoverflow.com/questions/16010204/get-reference-of-window-object-from-a-dom-element
    const widgetWindow = widgetContainer.ownerDocument.defaultView;
    this.widgetFrame = widgetWindow.document.createElement('iframe');

    (widgetContainer || widgetWindow.document.body).appendChild(this.widgetFrame);

    //  probably error after || ?    
    this.windowWidget = this.widgetFrame.contentWindow || this.widgetFrame.contentDocument.parentWindow;

    return this.sendHandShake(url)
      .then((widgetOrigin) => {
        this.widgetOrigin = widgetOrigin;

        this.events = {};

        this.listener = (widgetMessage) => {
          const { event, data, type } = (widgetMessage || {}).data;
          if (type === 'emit') {
            if (event in this.events && typeof this.events[event] === 'function') {
              this.events[event].call(this, data);
            }
          }
        };

        this.windowContainer.addEventListener('message', this.listener, false);
        return this;
      });
  }

  sendHandShake(url) {
    const targetOrigin = resolveOrigin(url);
    return new Promise((resolve, reject) => {
      const reply = (event) => {
        if (!sanitize(event, targetOrigin)) return false;

        if (event.data.type === 'handshakeReply') {
          this.windowContainer.removeEventListener('message', reply, false);
          return resolve(event.origin);
        }
        return reject('Failed handshake');
      };
      this.windowContainer.addEventListener('message', reply, false);
      const message = {
        mimeType: MIME_TYPE,
        type: 'handshake',
      };

      // It is necessary to use a timeout 0. Otherwise some race condition
      // will happen and the communication will be killed for security
      // concerns by the browser
      const loaded = () =>
        setTimeout(() =>
          this.windowWidget.postMessage(message, targetOrigin), 0);

      if (this.widgetFrame.attachEvent) {
        this.widgetFrame.attachEvent('onload', loaded);
      } else {
        this.widgetFrame.onload = loaded;
      }
      this.widgetFrame.src = url;
    });
  }

  call(action, data) {
    const message = {
      mimeType: MIME_TYPE,
      type: 'call',
      action,
      data,
    };
    this.windowWidget.postMessage(message, this.widgetOrigin);
  }

  on(eventName, callback) {
    this.events[eventName] = callback;
  }

  destroy() {
    this.windowContainer.removeEventListener('message', this.listener, false);
    this.widgetFrame.parentNode.removeChild(this.widgetFrame);
  }
}

/**
 * The entry point of the Widget
 * @type {Class}
 */
class Widget {

  /**
    * Initializes the widget, container, parent, and responds to the Container handshake
    * @param {Object} events Hash of functions or promises
    * @param {Object} actions Hash of functions or promises
    * @return {Promise} The Promise that resolves when the handshake has been received
    */
  constructor(args) {
    const { widgetWindow, events, actions, allowedOrigins, onlyManifest } = args;

    this.widgetWindow = widgetWindow || window;
    this.events = events || {};
    this.actions = actions || {};

    // this.allowedOrigins = allowedOrigins || [];
    // this.onlyManifest = onlyManifest || false;
    // this.actions.getManifest = () => console.log(this.manifest);

    this.manifest = this.getManifest();
    if (onlyManifest) {
      return Promise.resolve(this);
    }

    // this.containerWindow = containerWindow;
    this.widgetWindow.addEventListener('message', (event) => {
      if (!sanitize(event, this.containerOrigin)) return;

      const { action, data } = event.data;

      if (event.data.type === 'call') {
        debugger;
        if (action in this.actions && typeof this.actions[action] === 'function') {
          this.actions[action].call(this, data);
        }
        return;
      }
    });

    return this.sendHandshakeReply(allowedOrigins);
  }

  getManifest() {
    const events = [];
    Object.keys(this.events).forEach(name => events.push({ name }));

    const actions = [];
    Object.keys(this.actions).forEach(item =>
      actions.push({
        name: item,
        parameters: getParameterNames(this.actions[item]),
      })
    );

    return {
      name: 'TO_BE_DONE',
      url: 'url',
      actions,
      events,
    };
  }

  sendHandshakeReply(allowedOrigins) {
    return new Promise((resolve, reject) => {
      const listenAndReply = (event) => {
        // We refuse the handshake if the type is wrong
        if (event.data.type !== 'handshake') {
          return reject('Handshake Reply Failed');
        }

        // We refuse the handshake if the mimeType is wrong
        if (event.data.mimeType !== MIME_TYPE) {
          return reject('Handshake Reply Failed');
        }

        // We refuse the handshake if is not an allowed origin
        if (allowedOrigins.includes(event.origin) === false) {
          return reject('Handshake Reply Failed');
        }

        // Once we established the communication we remove this listener
        this.widgetWindow.removeEventListener('message', listenAndReply, false);

        // Then we answer to the handshake
        const message = {
          mimeType: MIME_TYPE,
          type: 'handshakeReply',
        };
        event.source.postMessage(message, event.origin);
        this.containerWindow = event.source;
        this.containerOrigin = event.origin;
        return resolve(this);
      };

      // We listen for incoming messages
      this.widgetWindow.addEventListener('message', listenAndReply, false);
    });
  }

  emit(event, data) {
    if (event in this.events) {
      const message = {
        mimeType: MIME_TYPE,
        type: 'emit',
        event,
        data,
      };
      this.containerWindow.postMessage(message, this.containerOrigin);
    }
  }
}

export { Container, Widget };
