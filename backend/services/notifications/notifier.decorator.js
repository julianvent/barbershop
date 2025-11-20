import { Notifier } from "./notifier.js";

/**
 * Base decorator that wraps another Notifier and delegates the send operation.
 */
export class NotifierDecorator extends Notifier {
  /**
   * @param {Notifier} notifier - The wrapped notifier instance.
   */
  constructor(notifier) {
    super();
    this.notifier = notifier;
  }

  /**
   * Delegates the notification to the wrapped notifier (if any).
   * @param {*} notification
   * @returns {Promise<*>|undefined}
   */
  async send(notification) {
    if (this.notifier && typeof this.notifier.send === "function") {
      return this.notifier.send(notification);
    }
    // If there is no wrapped notifier, nothing else to do.
  }
}
