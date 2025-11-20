import { buildHtml, displayNameFromEmail } from "../helper/mailgen.js";

export function renderAppointmentCanceled({ to, payload }) {
  const name = payload?.customerName || displayNameFromEmail(to?.email);
  const reason = payload?.reason || "";
  const intro = [
    `Hola ${name}, tu cita ha sido cancelada.`,
    reason ? `Motivo: ${reason}` : null,
  ].filter(Boolean);

  return {
    subject: "Tu cita ha sido cancelada",
    html: buildHtml({
      intro,
      outro: ["¿Hubo un problema? Puedes llamarnos para solucionarlo. Puedes reprogramar cuando quieras."],
    }),
  };
}
