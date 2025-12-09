import { buildHtml, displayNameFromEmail } from "../helper/mailgen.js";

export function renderAppointmentUpdated({ to, payload }) {
  const name = payload?.customerName || displayNameFromEmail(to?.email);
  const when = payload?.whenText || "";
  const link = payload?.appointmentLink;

  const intro = [
    `Hola ${name}, tu cita ha sido actualizada.`,
    when ? `Es el: ${when}` : null,
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
    subject: "Cita actualizada",
    html: buildHtml({
      intro,
      action: action,
      outro: ["Esperamos verte pronto."],
    }),
  };
}
