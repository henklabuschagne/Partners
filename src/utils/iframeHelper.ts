/**
 * Iframe Helper Utilities
 * Utilities for detecting and handling iframe embedding
 */

/**
 * Checks if the application is running inside an iframe
 */
export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access window.top due to cross-origin restrictions,
    // we're definitely in an iframe
    return true;
  }
}

/**
 * Gets the parent window origin if available
 */
export function getParentOrigin(): string | null {
  try {
    if (isInIframe() && window.parent) {
      return document.referrer ? new URL(document.referrer).origin : null;
    }
  } catch (e) {
    console.warn('Unable to get parent origin:', e);
  }
  return null;
}

/**
 * Sends a message to the parent window
 * Useful for communicating with the embedding application
 */
export function sendMessageToParent(message: any, targetOrigin: string = '*') {
  if (isInIframe() && window.parent) {
    try {
      window.parent.postMessage(message, targetOrigin);
    } catch (e) {
      console.error('Failed to send message to parent:', e);
    }
  }
}

/**
 * Listens for messages from the parent window
 * Returns a cleanup function to remove the listener
 */
export function listenToParentMessages(
  callback: (event: MessageEvent) => void,
  allowedOrigins?: string[]
): () => void {
  const handler = (event: MessageEvent) => {
    // If allowedOrigins is specified, validate the origin
    if (allowedOrigins && allowedOrigins.length > 0) {
      if (!allowedOrigins.includes(event.origin)) {
        console.warn('Message from unauthorized origin:', event.origin);
        return;
      }
    }
    
    callback(event);
  };

  window.addEventListener('message', handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('message', handler);
  };
}

/**
 * Notify parent that the app is ready
 */
export function notifyParentReady() {
  sendMessageToParent({
    type: 'PARTNER_MANAGEMENT_READY',
    timestamp: Date.now(),
    version: '1.0.0'
  });
}

/**
 * Request full screen mode from parent (if supported)
 */
export function requestFullScreen() {
  sendMessageToParent({
    type: 'REQUEST_FULLSCREEN',
    timestamp: Date.now()
  });
}

/**
 * Report height changes to parent for responsive iframe sizing
 */
export function reportHeightToParent(height?: number) {
  const actualHeight = height || document.documentElement.scrollHeight;
  sendMessageToParent({
    type: 'HEIGHT_CHANGE',
    height: actualHeight,
    timestamp: Date.now()
  });
}
