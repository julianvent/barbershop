/**
 * @class
 * @param {Object} params - Notification parameters
 * @param {string} params.appointmentId - The ID of the appointment
 * @param {{email?: string, phone?: string}} params.to - Recipient contact info
 * @param {string} params.type - The type of notification
 * @param {string} params.message - The notification message content
 * @param {Date} params.sendAt - The scheduled time to send the notification
 * @param {Object} [params.payload] - Additional payload data for template rendering
 */
export class NotificationDTO {
  constructor({ appointmentId, to, type, subject, message, sendAt, payload }) {
    this.appointmentId = appointmentId;
    this.to = to;
    this.type = type;
    this.subject = subject;
    this.message = message;
    this.sendAt = sendAt;
    this.payload = payload || {};
  }
}
