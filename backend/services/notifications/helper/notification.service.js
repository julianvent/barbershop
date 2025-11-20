import { Notifier } from "../notifier.js";
import { EmailNotifierDecorator } from "../notification.email.decorator.js";
import { NotificationDTO } from "../notification.dto.js";
import { NotificationType } from "../notification.types.js";

function isTrue(v) {
  return String(v || "").toLowerCase() === "true";
}

function buildNotifierChain() {
  let notifier = new Notifier();
  if (isTrue(process.env.ENABLE_EMAIL)) {
    notifier = new EmailNotifierDecorator(notifier);
  }
  return notifier;
}
const notifierChain = buildNotifierChain();

function toRecipient(appointment) {
  try {
    return {
      email: appointment.customer_email,
      phone: appointment.customer_phone,
    };
  } catch {
    throw new Error("Unable to extract recipient from appointment", {
      cause: appointment,
    });
  }
}

function mexDate(dt) {
  try {
    return new Date(dt).toLocaleString("es-MX", { hour12: false });
  } catch {
    return String(dt);
  }
}

export const NotificationService = {
  async appointmentCreated(appt) {
    const dto = new NotificationDTO({
      appointmentId: appt.id,
      to: toRecipient(appt),
      type: NotificationType.APPOINTMENT_CREATED,
      payload: {
        customerName: appt.customer_name,
        whenText: mexDate(appt.appointment_datetime),
        barber: appt.barber_id,
      },
    });
    await notifierChain.send(dto);
  },

  async appointmentConfirmed(appt) {
    const dto = new NotificationDTO({
      appointmentId: appt.id,
      to: toRecipient(appt),
      type: NotificationType.APPOINTMENT_CONFIRMED,
      payload: {
        customerName: appt.customer_name,
        whenText: mexDate(appt.appointment_datetime),
      },
    });
    await notifierChain.send(dto);
  },

  async appointmentCanceled(appt, reason = "") {
    const dto = new NotificationDTO({
      appointmentId: appt.id,
      to: toRecipient(appt),
      type: NotificationType.APPOINTMENT_CANCELED,
      payload: {
        customerName: appt.customer_name,
        reason,
      },
    });
    await notifierChain.send(dto);
  },

  async appointmentReminder(appt) {
    const dto = new NotificationDTO({
      appointmentId: appt.id,
      to: toRecipient(appt),
      type: NotificationType.APPOINTMENT_REMINDER,
      payload: {
        customerName: appt.customer_name,
        whenText: mexDate(appt.appointment_datetime),
      },
    });
    await notifierChain.send(dto);
  },

  async appointmentUpdated(appt) {
    const dto = new NotificationDTO({
      appointmentId: appt.id,
      to: toRecipient(appt),
      type: NotificationType.APPOINTMENT_UPDATED,
      payload: {
        customerName: appt.customer_name,
        whenText: mexDate(appt.appointment_datetime),
      },
    });
    await notifierChain.send(dto);
  },
};
