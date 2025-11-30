import { renderAppointmentCreated } from "./templates/appointment.created.js";
import { renderAppointmentConfirmed } from "./templates/appointment.confirmed.js";
import { renderAppointmentCanceled } from "./templates/appointment.canceled.js";
import { renderAppointmentReminder } from "./templates/appointment.reminder.js";
import { renderAppointmentUpdated } from "./templates/appointment.updated.js";

/**
 * Registry map for notification renderers.
 * This provides O(1) lookup time and makes it easy to add new notification types.
 */
export const NotificationType = Object.freeze({
  APPOINTMENT_CREATED: "appointment.created",
  APPOINTMENT_CONFIRMED: "appointment.confirmed",
  APPOINTMENT_CANCELED: "appointment.canceled",
  APPOINTMENT_REMINDER: "appointment.reminder",
  APPOINTMENT_UPDATED: "appointment.updated",
});

export const NOTIFICATION_RENDERERS = new Map([
  [NotificationType.APPOINTMENT_CREATED, renderAppointmentCreated],
  [NotificationType.APPOINTMENT_CONFIRMED, renderAppointmentConfirmed],
  [NotificationType.APPOINTMENT_CANCELED, renderAppointmentCanceled],
  [NotificationType.APPOINTMENT_REMINDER, renderAppointmentReminder],
  [NotificationType.APPOINTMENT_UPDATED, renderAppointmentUpdated],
]);
