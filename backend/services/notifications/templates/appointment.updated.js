import { buildHtml, displayNameFromEmail } from "../helper/mailgen.js";

export function renderAppointmentUpdated({ to, payload }) {
  const name = payload?.customerName || displayNameFromEmail(to?.email);
  const when = payload?.whenText || "";
  const intro = [
    `Hola ${name}, tu cita ha sido actualizada.`,
    when ? `Es el: ${when}` : null,
  ].filter(Boolean);

  return {
    subject: "Cita actualizada",
    html: buildHtml({
      intro,
      outro: ["Esperamos verte pronto."],
    }),
  };
}
