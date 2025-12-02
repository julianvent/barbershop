import { buildHtml, displayNameFromEmail } from "../helper/mailgen.js";

export function renderAppointmentCreated({ to, payload }) {
  const name = payload?.customerName || displayNameFromEmail(to?.email);
  const when = payload?.whenText || "";
  const link = payload?.appointmentLink;
  const intro = [
    `Hola ${name}, tu cita ha sido creada.`,
    when ? `Fecha y hora: ${when}` : null,
    link ? `Puedes ver los detalles y estado de tu cita en el siguiente enlace:` : null

  ].filter(Boolean);

  const action = link
  ? {
      instructions: "Haz clic en el botón para ver tu cita:",
      button: {
        color: "#3869D4",
        text: "Ver mi cita",
        link: link,
    },
    }
  : null;
  return {
    subject: "Tu cita ha sido creada",
    html: buildHtml({ intro, action: action , outro: ["Gracias por reservar con nosotros."] }),
  };
}
