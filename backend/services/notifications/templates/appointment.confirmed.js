import { buildHtml, displayNameFromEmail } from "../helper/mailgen.js";

export function renderAppointmentConfirmed({ to, payload }) {
  const name = payload?.customerName || displayNameFromEmail(to?.email);
  const when = payload?.whenText || "";
  const intro = [
    `¡Listo ${name}! Tu cita ha sido confirmada.`,
    when ? `Te esperamos el: ${when}` : null,
  ].filter(Boolean);

  return {
    subject: "Tu cita ha sido confirmada",
    html: buildHtml({
      intro,
      outro: ["Si necesitas reprogramar, respóndenos."],
    }),
  };
}
