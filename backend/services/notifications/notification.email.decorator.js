import { NotifierDecorator } from "./notifier.decorator.js";
import { sendEmail } from "../integrations/email.client.js";
import { NOTIFICATION_RENDERERS } from "./notification.types.js";

/**
 * Default fallback renderer for unknown notification types
 */
const DEFAULT_RENDERER = () => ({
  subject: "Notificación",
  html: "<p>Hola, ten un buen día. 🤖</p>",
});

/**
 * Renders email content based on notification type
 * @param {Object} params - The rendering parameters
 * @param {string} params.type - The notification type
 * @param {Object} params.to - The recipient information
 * @param {Object} params.payload - The notification payload
 * @returns {Object} Object containing subject and html properties
 */
function renderByType({ type, to, payload }) {
  const renderer = NOTIFICATION_RENDERERS.get(type) || DEFAULT_RENDERER;
  return renderer({ to, payload });
}

export class EmailNotifierDecorator extends NotifierDecorator {
  /**
   * Sends the email notification and then delegates to the next notifier
   * in the chain (if any).
   * @param {*} notification
   */
  async send(notification) {
    if (!notification.to.email) {
      return super.send(notification);
    }

    const { subject, html } = renderByType({
      type: notification.type,
      to: notification.to,
      payload: notification.payload,
    });

    await sendEmail({
      to: notification.to.email,
      subject: subject || "Recordatorio de cita",
      html: html,
    });

    return super.send(notification);
  }
}
