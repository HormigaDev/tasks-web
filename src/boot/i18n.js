import { createI18n } from "vue-i18n";
import messages from "src/i18n";
import { getLocale } from "src/functions/configs";

export default async ({ app }) => {
  const locale = await getLocale();
  const i18n = createI18n({
    locale: locale || "en-US",
    legacy: false,
    messages,
  });

  app.use(i18n);
};
