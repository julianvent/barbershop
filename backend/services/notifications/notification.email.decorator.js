import { NotifierDecorator } from "./notifier.decorator.js";
import { sendEmail } from "../integrations/email.client.js";
import { NotificationType } from "./notification.types.js";

import { renderAppointmentCreated } from "./templates/appointment.created.js";
import { renderAppointmentConfirmed } from "./templates/appointment.confirmed.js";
import { renderAppointmentCanceled } from "./templates/appointment.canceled.js";
import { renderAppointmentReminder } from "./templates/appointment.reminder.js";
import { renderAppointmentUpdated } from "./templates/appointment.updated.js";

function renderByType({ type, to, payload }) {
  switch (type) {
    case NotificationType.APPOINTMENT_CREATED:
      return renderAppointmentCreated({ to, payload });
    case NotificationType.APPOINTMENT_CONFIRMED:
      return renderAppointmentConfirmed({ to, payload });
    case NotificationType.APPOINTMENT_CANCELED:
      return renderAppointmentCanceled({ to, payload });
    case NotificationType.APPOINTMENT_REMINDER:
      return renderAppointmentReminder({ to, payload });
    case NotificationType.APPOINTMENT_UPDATED:
      return renderAppointmentUpdated({ to, payload });
    default:
      return {
        subject: "Notificación",
        html: "<p>Hola, ten un buen día. 🤖</p>",
      };
  }
}

export class EmailNotifierDecorator extends NotifierDecorator {
  /**
   * Sends the email notification and then delegates to the next notifier
   * in the chain (if any).
   * @param {*} notification
   */
  async send(notification) {
    if (!notification.to.email) {
      return super.send(notification); // maybe throwing or returning a JSON response
    }

    const { subject, html } = renderByType({
      type: notification.type,
      to: notification.to,
      payload: notification.payload,
    });

    await sendEmail({
      to: notification.to.email,
      subject: "Recordatorio de cita" || subject,
      html: html,
    });

    return super.send(notification);
  }
}
