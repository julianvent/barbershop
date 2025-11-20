import { buildHtml, displayNameFromEmail } from "../helper/mailgen.js";

export function renderAppointmentCreated({ to, payload }) {
  const name = payload?.customerName || displayNameFromEmail(to?.email);
  const when = payload?.whenText || "";
  const intro = [
    `Hola ${name}, tu cita ha sido creada.`,
    when ? `Fecha y hora: ${when}` : null,
  ].filter(Boolean);

  return {
    subject: "Tu cita ha sido creada",
    html: buildHtml({ intro, outro: ["Gracias por reservar con nosotros."] }),
  };
}
