export type Locale = "de" | "en" | "es" | "fr";

type TranslationKey =
  | "pageTitle"
  | "sectionTitle"
  | "sectionDescription"
  | "phoneLabel"
  | "phoneHelper"
  | "messageLabel"
  | "showCloseLabel"
  | "buttonSizeLabel"
  | "buttonSizeS"
  | "buttonSizeM"
  | "buttonTextLabel"
  | "buttonTextPlaceholder"
  | "delayLabel"
  | "previewButtonLabel"
  | "previewChatLabel"
  | "appearanceTitle"
  | "saveButton"
  | "toastSaved"
  | "sendAria"
  | "whatsappAria"
  | "navHome"
  | "navAdditional"
  | "navWhatsapp"
  | "navAppearance"
  | "messageInfo"
  | "appearancePageTitle"
  | "appearanceSectionDescription";

const translations: Record<Locale, Record<TranslationKey, string>> = {
  de: {
    pageTitle: "Best Chat Button",
    sectionTitle: "Einstellungen",
    sectionDescription:
      "Lege fest, welche Nachricht vorbefüllt wird und welche WhatsApp-Nummer kontaktiert wird.",
    phoneLabel: "WhatsApp-Nummer",
    phoneHelper:
      "Bitte im internationalen Format ohne + eingeben. (z.B. 491711234567)",
    messageLabel: "Nachricht im Chat",
    showCloseLabel: "Schließen\u2011Icon anzeigen",
    buttonSizeLabel: "Button\u2011Größe",
    buttonSizeS: "S (nur Icon)",
    buttonSizeM: "M (Icon + Text)",
    buttonTextLabel: "Button\u2011Text",
    buttonTextPlaceholder: "z.B. Bei WhatsApp schreiben",
    delayLabel: "Anzeigen nach (Sek.)",
    previewButtonLabel: "Vorschau Button",
    previewChatLabel: "Vorschau Nachricht im Chat",
    appearanceTitle: "Erscheinungsbild des Chat Buttons",
    saveButton: "Speichern",
    toastSaved: "Einstellungen gespeichert",
    sendAria: "Senden",
    whatsappAria: "WhatsApp",
    navHome: "Home",
    navAdditional: "Additional page",
    navWhatsapp: "Chat-Einstellungen",
    navAppearance: "Erscheinungsbild",
    messageInfo:
      "Dieser Text wird für den Nutzer schon vorausgefüllt, sodass dieser weniger Text selber eingeben muss",
    appearancePageTitle: "Erscheinungsbild",
    appearanceSectionDescription:
      "Passe das Aussehen und Verhalten des Chat-Buttons auf deiner Seite an.",
  },
  en: {
    pageTitle: "Best Chat Button",
    sectionTitle: "Settings",
    sectionDescription:
      "Set the prefilled message and the WhatsApp number to contact.",
    phoneLabel: "WhatsApp number",
    phoneHelper: "Use international format without + (e.g. 491711234567)",
    messageLabel: "Message in chat",
    showCloseLabel: "Show close icon",
    buttonSizeLabel: "Button size",
    buttonSizeS: "S (icon only)",
    buttonSizeM: "M (icon + text)",
    buttonTextLabel: "Button text",
    buttonTextPlaceholder: "e.g. Message on WhatsApp",
    delayLabel: "Show after (sec)",
    previewButtonLabel: "Button preview",
    previewChatLabel: "Chat message preview",
    appearanceTitle: "Chat button appearance",
    saveButton: "Save",
    toastSaved: "Settings saved",
    sendAria: "Send",
    whatsappAria: "WhatsApp",
    navHome: "Home",
    navAdditional: "Additional page",
    navWhatsapp: "Chat settings",
    navAppearance: "Appearance",
    messageInfo:
      "This text is prefilled for the customer so they have to type less themselves",
    appearancePageTitle: "Appearance",
    appearanceSectionDescription:
      "Customize the look and behavior of the chat button on your storefront.",
  },
  es: {
    pageTitle: "Best Chat Button",
    sectionTitle: "Ajustes",
    sectionDescription:
      "Define el mensaje prellenado y el n\u00famero de WhatsApp a contactar.",
    phoneLabel: "N\u00famero de WhatsApp",
    phoneHelper: "Usa formato internacional. (p. ej. 491711234567)",
    messageLabel: "Mensaje en el chat",
    showCloseLabel: "Mostrar icono de cierre",
    buttonSizeLabel: "Tama\u00f1o del bot\u00f3n",
    buttonSizeS: "S (solo icono)",
    buttonSizeM: "M (icono + texto)",
    buttonTextLabel: "Texto del bot\u00f3n",
    buttonTextPlaceholder: "p. ej. Escribir por WhatsApp",
    delayLabel: "Mostrar despu\u00e9s (seg.)",
    previewButtonLabel: "Vista previa del bot\u00f3n",
    previewChatLabel: "Vista previa del chat",
    appearanceTitle: "Apariencia del bot\u00f3n de chat",
    saveButton: "Guardar",
    toastSaved: "Ajustes guardados",
    sendAria: "Enviar",
    whatsappAria: "WhatsApp",
    navHome: "Inicio",
    navAdditional: "P\u00e1gina adicional",
    navWhatsapp: "Ajustes del chat",
    navAppearance: "Apariencia",
    messageInfo:
      "Este texto se prellena para el cliente para que tenga que escribir menos",
    appearancePageTitle: "Apariencia",
    appearanceSectionDescription:
      "Personaliza la apariencia y el comportamiento del bot\u00f3n de chat en tu tienda.",
  },
  fr: {
    pageTitle: "Best Chat Button",
    sectionTitle: "Param\u00e8tres",
    sectionDescription:
      "D\u00e9finissez le message pr\u00e9rempli et le num\u00e9ro WhatsApp \u00e0 contacter.",
    phoneLabel: "Num\u00e9ro WhatsApp",
    phoneHelper: "Utilisez le format international. (ex. 491711234567)",
    messageLabel: "Message dans le chat",
    showCloseLabel: "Afficher l'ic\u00f4ne de fermeture",
    buttonSizeLabel: "Taille du bouton",
    buttonSizeS: "S (ic\u00f4ne seule)",
    buttonSizeM: "M (ic\u00f4ne + texte)",
    buttonTextLabel: "Texte du bouton",
    buttonTextPlaceholder: "ex. \u00c9crire sur WhatsApp",
    delayLabel: "Afficher apr\u00e8s (s)",
    previewButtonLabel: "Aper\u00e7u du bouton",
    previewChatLabel: "Aper\u00e7u du chat",
    appearanceTitle: "Apparence du bouton de chat",
    saveButton: "Enregistrer",
    toastSaved: "Param\u00e8tres enregistr\u00e9s",
    sendAria: "Envoyer",
    whatsappAria: "WhatsApp",
    navHome: "Accueil",
    navAdditional: "Page suppl\u00e9mentaire",
    navWhatsapp: "Param\u00e8tres du chat",
    navAppearance: "Apparence",
    messageInfo:
      "Ce texte est pr\u00e9rempli pour le client afin qu'il ait moins \u00e0 saisir",
    appearancePageTitle: "Apparence",
    appearanceSectionDescription:
      "Personnalisez l'apparence et le comportement du bouton de chat sur votre boutique.",
  },
};

export function getLocaleFromRequest(request: Request): Locale {
  const header = request.headers.get("accept-language") || "";
  const candidates = header
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (candidate.startsWith("de")) return "de";
    if (candidate.startsWith("en")) return "en";
    if (candidate.startsWith("es")) return "es";
    if (candidate.startsWith("fr")) return "fr";
  }

  return "en";
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] ?? translations.en[key];
}

export function getDefaultMessage(locale: Locale): string {
  switch (locale) {
    case "de":
      return "Hallo! Ich habe eine Frage zu meinem Einkauf.";
    case "es":
      return "\u00a1Hola! Tengo una pregunta sobre mi compra.";
    case "fr":
      return "Bonjour ! J'ai une question concernant mon achat.";
    case "en":
    default:
      return "Hi! I have a question about my purchase.";
  }
}

export function getDefaultButtonLabel(locale: Locale): string {
  switch (locale) {
    case "de":
      return "Bei WhatsApp schreiben";
    case "es":
      return "Escribir por WhatsApp";
    case "fr":
      return "\u00c9crire sur WhatsApp";
    case "en":
    default:
      return "Message on WhatsApp";
  }
}
