import Mailgen from "mailgen";

export function getMailGenerator() {
  return new Mailgen({
    theme: "default",
    product: {
      name: process.env.APP_NAME || "SAGOZ Barbería",
      link:
        process.env.APP_URL ||
        "https://www.facebook.com/people/La-barber%C3%ADa/61558965209759/#",
    },
  });
}

/**
 * Build a HTML email content
 * @param {{intro: string[]; outro?: string[]}}
 */
export function buildHtml({ intro, outro, action = [] }) {
  const mg = getMailGenerator();
  return mg.generate({ body: { intro, outro, action } });
}

/**
 * Utility to get a display name from an email address
 */
export function displayNameFromEmail(toEmail, fallback = "Cliente") {
  if (!toEmail) return fallback;
  const local = toEmail.split("@")[0] || "";
  return local || fallback;
}
