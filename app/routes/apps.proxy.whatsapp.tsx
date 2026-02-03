import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { getDefaultButtonLabel, getDefaultMessage, getLocaleFromRequest } from "../i18n";

type WhatsappSettings = {
  shop: string;
  phone: string | null;
  message: string | null;
  showClose: boolean;
  buttonSize: string;
  buttonLabel: string | null;
  showDelaySeconds: number;
  createdAt: Date;
  updatedAt: Date;
};

type WhatsappSettingsDelegate = {
  findUnique: (args: {
    where: { shop: string };
  }) => Promise<WhatsappSettings | null>;
};

const prismaClient = prisma as typeof prisma & {
  whatsappSettings: WhatsappSettingsDelegate;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  const { searchParams } = new URL(request.url);
  const shop = session?.shop ?? searchParams.get("shop") ?? "";
  const locale = getLocaleFromRequest(request);

  if (!shop) {
    return new Response("", {
      headers: { "content-type": "application/javascript; charset=utf-8" },
    });
  }

  const settings = await prismaClient.whatsappSettings.findUnique({
    where: { shop },
  });
  const phone = settings?.phone ?? "";
  const message = settings?.message ?? getDefaultMessage(locale);
  const showClose = settings?.showClose ?? true;
  const buttonSize = settings?.buttonSize === "M" ? "M" : "S";
  const buttonLabel = settings?.buttonLabel ?? getDefaultButtonLabel(locale);
  const showDelaySeconds = Math.max(0, settings?.showDelaySeconds ?? 0);

  const script = `
(function () {
  var phone = ${JSON.stringify(phone)};
  var message = ${JSON.stringify(message)};
  if (!phone) return;
  var cleanedPhone = phone.replace(/[^0-9]/g, "");
  if (!cleanedPhone) return;
  if (document.getElementById("the-best-whatsapp-button-whatsapp-button")) return;
  try {
    if (window.localStorage && localStorage.getItem("the-best-whatsapp-button-whatsapp-closed") === "1") {
      return;
    }
  } catch (e) {}

  var container = document.createElement("div");
  container.id = "the-best-whatsapp-button-whatsapp-button";
  container.style.position = "fixed";
  var closeOffset = ${JSON.stringify(showClose)} ? 10 : 0;
  var sizeOffset = isMedium ? 400 : 0;
  container.style.right = (16 + closeOffset + sizeOffset) + "px";
  container.style.bottom = "16px";
  container.style.zIndex = "9999";
  container.style.width = isMedium ? "222px" : "52px";
  container.style.height = "52px";
  container.style.overflow = "visible";
  container.style.display = "flex";
  container.style.alignItems = "center";
  if (isMedium) {
    container.style.width = "auto";
    container.style.height = "auto";
  }
  container.style.display = "none";

  var button = document.createElement("button");
  button.type = "button";
  button.textContent = "";
  var isMedium = ${JSON.stringify(buttonSize)} === "M";
  button.style.width = isMedium ? "auto" : "52px";
  button.style.height = "52px";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.gap = "8px";
  button.style.padding = isMedium ? "0 14px" : "0";
  button.style.borderRadius = "999px";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.background = "#25D366";
  button.style.color = "#ffffff";
  button.style.fontSize = isMedium ? "14px" : "0";
  button.style.fontWeight = "600";
  button.style.boxShadow = "0 10px 24px rgba(0,0,0,0.18)";
  button.setAttribute("aria-label", "WhatsApp");
  button.style.position = "relative";

  var close = document.createElement("button");
  if (${JSON.stringify(showClose)}) {
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "WhatsApp Button schließen");
    close.style.position = "absolute";
    close.style.top = "-10px";
    close.style.right = "-10px";
    close.style.width = "22px";
    close.style.height = "22px";
    close.style.borderRadius = "999px";
    close.style.background = "#ffffff";
    close.style.color = "#111111";
    close.style.border = "1px solid rgba(0,0,0,0.15)";
    close.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
    close.style.display = "flex";
    close.style.alignItems = "center";
    close.style.justifyContent = "center";
    close.style.fontSize = "18px";
    close.style.lineHeight = "1";
    close.style.cursor = "pointer";
  }

  button.addEventListener("click", function () {
    var url = "https://wa.me/" + cleanedPhone + "?text=" + encodeURIComponent(message || "");
    window.open(url, "_blank", "noopener");
  });

  if (${JSON.stringify(showClose)}) {
    close.addEventListener("click", function (event) {
      event.stopPropagation();
      try {
        if (window.localStorage) {
          localStorage.setItem("the-best-whatsapp-button-whatsapp-closed", "1");
        }
      } catch (e) {}
      if (container.parentNode) container.parentNode.removeChild(container);
    });
  }
  var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 32 32");
  icon.setAttribute("width", "32");
  icon.setAttribute("height", "32");
  icon.setAttribute("aria-hidden", "true");

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M19.11 17.23c-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.71-1.33-1.59-1.48-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.11 2.82.14.18 1.93 2.95 4.68 4.14.65.28 1.15.45 1.54.58.65.21 1.24.18 1.71.11.52-.08 1.58-.65 1.8-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.02 26.86h-.01a10.79 10.79 0 0 1-5.5-1.5l-.39-.23-4.08 1.07 1.09-3.98-.25-.41a10.76 10.76 0 1 1 9.14 5.05zm0-20.32a9.56 9.56 0 0 0-8.14 14.55l.41.66-.64 2.34 2.41-.63.64.38a9.55 9.55 0 1 0 5.32-17.3z"
  );
  path.setAttribute("fill", "#ffffff");
  icon.appendChild(path);

  button.appendChild(icon);
  if (isMedium) {
    var label = document.createElement("span");
    label.textContent = ${JSON.stringify(buttonLabel)};
    label.style.fontSize = "14px";
    label.style.color = "#ffffff";
    label.style.whiteSpace = "nowrap";
    button.appendChild(label);
  }
  container.appendChild(button);
  if (${JSON.stringify(showClose)}) {
    container.appendChild(close);
  }
  document.body.appendChild(container);
  setTimeout(function () {
    container.style.display = "block";
  }, ${JSON.stringify(showDelaySeconds)} * 1000);
})();`;

  return new Response(script, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};
