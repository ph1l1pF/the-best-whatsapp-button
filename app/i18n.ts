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
  | "messageInfo";

const translations: Record<Locale, Record<TranslationKey, string>> = {
  de: {
    pageTitle: "WhatsApp Button",
    sectionTitle: "Einstellungen",
    sectionDescription:
      "Lege fest, welche Nachricht vorbefüllt wird und welche WhatsApp-Nummer kontaktiert wird.",
    phoneLabel: "WhatsApp-Nummer",
    phoneHelper:
      "Bitte im internationalen Format eingeben. (z.B. +491711234567)",
    messageLabel: "Nachricht im Chat",
    showCloseLabel: "Schließen‑Icon anzeigen",
    buttonSizeLabel: "Button‑Größe",
    buttonSizeS: "S (nur Icon)",
    buttonSizeM: "M (Icon + Text)",
    buttonTextLabel: "Button‑Text",
    buttonTextPlaceholder: "z.B. Bei WhatsApp schreiben",
    delayLabel: "Anzeigen nach (Sek.)",
    previewButtonLabel: "Vorschau Button",
    previewChatLabel: "Vorschau Nachricht im Chat",
    appearanceTitle: "Erscheinungsbild des WhatsApp Buttons",
    saveButton: "Speichern",
    toastSaved: "WhatsApp-Einstellungen gespeichert",
    sendAria: "Senden",
    whatsappAria: "WhatsApp",
    navHome: "Home",
    navAdditional: "Additional page",
    navWhatsapp: "WhatsApp Button",
    messageInfo:
      "Dieser Text wird für den Nutzer schon vorausgefüllt, sodass dieser weniger Text selber eingeben muss",
  },
  en: {
    pageTitle: "WhatsApp Button",
    sectionTitle: "Settings",
    sectionDescription:
      "Set the prefilled message and the WhatsApp number to contact.",
    phoneLabel: "WhatsApp number",
    phoneHelper: "Use international format. (e.g. +491711234567)",
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
    appearanceTitle: "WhatsApp button appearance",
    saveButton: "Save",
    toastSaved: "WhatsApp settings saved",
    sendAria: "Send",
    whatsappAria: "WhatsApp",
    navHome: "Home",
    navAdditional: "Additional page",
    navWhatsapp: "WhatsApp Button",
    messageInfo:
      "This text is prefilled for the customer so they have to type less themselves",
  },
  es: {
    pageTitle: "Botón de WhatsApp",
    sectionTitle: "Ajustes",
    sectionDescription:
      "Define el mensaje prellenado y el número de WhatsApp a contactar.",
    phoneLabel: "Número de WhatsApp",
    phoneHelper: "Usa formato internacional. (p. ej. +491711234567)",
    messageLabel: "Mensaje en el chat",
    showCloseLabel: "Mostrar icono de cierre",
    buttonSizeLabel: "Tamaño del botón",
    buttonSizeS: "S (solo icono)",
    buttonSizeM: "M (icono + texto)",
    buttonTextLabel: "Texto del botón",
    buttonTextPlaceholder: "p. ej. Escribir por WhatsApp",
    delayLabel: "Mostrar después (seg.)",
    previewButtonLabel: "Vista previa del botón",
    previewChatLabel: "Vista previa del chat",
    appearanceTitle: "Apariencia del botón de WhatsApp",
    saveButton: "Guardar",
    toastSaved: "Ajustes de WhatsApp guardados",
    sendAria: "Enviar",
    whatsappAria: "WhatsApp",
    navHome: "Inicio",
    navAdditional: "Página adicional",
    navWhatsapp: "Botón de WhatsApp",
    messageInfo:
      "Este texto se prellena para el cliente para que tenga que escribir menos",
  },
  fr: {
    pageTitle: "Bouton WhatsApp",
    sectionTitle: "Paramètres",
    sectionDescription:
      "Définissez le message prérempli et le numéro WhatsApp à contacter.",
    phoneLabel: "Numéro WhatsApp",
    phoneHelper: "Utilisez le format international. (ex. +491711234567)",
    messageLabel: "Message dans le chat",
    showCloseLabel: "Afficher l’icône de fermeture",
    buttonSizeLabel: "Taille du bouton",
    buttonSizeS: "S (icône seule)",
    buttonSizeM: "M (icône + texte)",
    buttonTextLabel: "Texte du bouton",
    buttonTextPlaceholder: "ex. Écrire sur WhatsApp",
    delayLabel: "Afficher après (s)",
    previewButtonLabel: "Aperçu du bouton",
    previewChatLabel: "Aperçu du chat",
    appearanceTitle: "Apparence du bouton WhatsApp",
    saveButton: "Enregistrer",
    toastSaved: "Paramètres WhatsApp enregistrés",
    sendAria: "Envoyer",
    whatsappAria: "WhatsApp",
    navHome: "Accueil",
    navAdditional: "Page supplémentaire",
    navWhatsapp: "Bouton WhatsApp",
    messageInfo:
      "Ce texte est prérempli pour le client afin qu’il ait moins à saisir",
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
      return "¡Hola! Tengo una pregunta sobre mi compra.";
    case "fr":
      return "Bonjour ! J’ai une question concernant mon achat.";
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
      return "Écrire sur WhatsApp";
    case "en":
    default:
      return "Message on WhatsApp";
  }
}
