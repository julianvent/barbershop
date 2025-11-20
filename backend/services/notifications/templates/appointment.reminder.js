import { buildHtml, displayNameFromEmail } from "../helper/mailgen.js";

export function renderAppointmentReminder({ to, payload }) {
  const name = payload?.customerName || displayNameFromEmail(to?.email);
  const when = payload?.whenText || "";
  const intro = [
    `Hola ${name}, este es un recordatorio de tu cita.`,
    when ? `Es el: ${when}` : null,
  ].filter(Boolean);

  return {
    subject: "Recordatorio de tu cita",
    html: buildHtml({
      intro,
      outro: ["¡Te esperamos! Llega 5 minutos antes, por favor."],
    }),
  };
}
