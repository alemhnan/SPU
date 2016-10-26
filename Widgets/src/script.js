/* eslint-disable no-param-reassign */

// this.frame = document.createElement('iframe');
//     (container || document.body).appendChild(this.frame);

const Promise = (() => {
  try {
    return window ? window.Promise : Promise;
  } catch (e) {
    return null;
  }
})();

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

  // Events could be just strings
  if (typeof message.event !== 'string') return false;

  // Type of message could be only one of the following
  if (!{ handshakeReply: 1, handshake: 1, emit: 1, listen: 1 }[message.data.type]) return false;
  return true;
};

const sendHandShake = (ContainerWindow, widgetIframe, url) => {
  const targetOrigin = resolveOrigin(url);
  return new Promise((resolve, reject) => {
    const reply = (event) => {
      if (!sanitize(event, targetOrigin)) return false;

      if (event.data.type === 'handshakeReply') {
        ContainerWindow.removeEventListener('message', reply, false);
        return resolve(event.origin);
      }
      return reject('Failed handshake');
    };
    ContainerWindow.addEventListener('message', reply, false);
    const message = {
      mimeType: MIME_TYPE,
      type: 'handshake',
    };
    widgetIframe.postMessage(message, targetOrigin);
    widgetIframe.src = url;
  });
};

const listenAndReplyToHandShake = (widgetWindow, allowedOrigins) =>
  new Promise((resolve, reject) => {
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
      widgetWindow.removeEventListener('message', listenAndReply, false);

      // Then we answer to the handshake
      const message = {
        mimeType: MIME_TYPE,
        type: 'handshakeReply',
      };

      event.source.postMessage(message, event.origin);
      return resolve(event.origin);
    };
    // We listen for messages
    widgetWindow.addEventListener('message', listenAndReply, false);
  });

// const SPU = { listenAndReplyToHandShake, sendHandShake };
export { listenAndReplyToHandShake, sendHandShake };
export { inIframe };

// // Export
// exports.listenAndReplyToHandShake = listenAndReplyToHandShake;
// exports.sendHandShake = sendHandShake;
// exports.inIframe = inIframe;
