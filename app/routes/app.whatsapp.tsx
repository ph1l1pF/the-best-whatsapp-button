import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  getDefaultButtonLabel,
  getDefaultMessage,
  getLocaleFromRequest,
  t,
  type Locale,
} from "../i18n";

type LoaderData = {
  locale: Locale;
  phone: string;
  message: string;
  showClose: boolean;
  buttonSize: "S" | "M";
  buttonLabel: string;
  showDelaySeconds: number;
};

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
  upsert: (args: {
    where: { shop: string };
    update: {
      phone?: string;
      message?: string;
      showClose?: boolean;
      buttonSize?: string;
      buttonLabel?: string;
      showDelaySeconds?: number;
    };
    create: {
      shop: string;
      phone?: string;
      message?: string;
      showClose?: boolean;
      buttonSize?: string;
      buttonLabel?: string;
      showDelaySeconds?: number;
    };
  }) => Promise<WhatsappSettings>;
};

const prismaClient = prisma as typeof prisma & {
  whatsappSettings: WhatsappSettingsDelegate;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const locale = getLocaleFromRequest(request);

  const settings = await prismaClient.whatsappSettings.findUnique({
    where: { shop: session.shop },
  });

  return {
    locale,
    phone: settings?.phone ?? "",
    message: settings?.message ?? getDefaultMessage(locale),
    showClose: settings?.showClose ?? true,
    buttonSize: (settings?.buttonSize === "M" ? "M" : "S") as "S" | "M",
    buttonLabel: settings?.buttonLabel ?? getDefaultButtonLabel(locale),
    showDelaySeconds: Math.max(0, settings?.showDelaySeconds ?? 0),
  } satisfies LoaderData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const rawPhone = (formData.get("phone")?.toString() ?? "").trim();
  const phone = rawPhone.replace(/[^0-9]/g, "");
  const message = (formData.get("message")?.toString() ?? "").trim();
  const showClose = formData.get("showClose") === "on";
  const buttonSize =
    formData.get("buttonSize")?.toString() === "M" ? "M" : "S";
  const buttonLabel = (formData.get("buttonLabel")?.toString() ?? "").trim();
  const showDelaySeconds = Math.max(
    0,
    Number(formData.get("showDelaySeconds")?.toString() ?? 0),
  );

  await prismaClient.whatsappSettings.upsert({
    where: { shop: session.shop },
    update: {
      phone,
      message,
      showClose,
      buttonSize,
      buttonLabel,
      showDelaySeconds,
    },
    create: {
      shop: session.shop,
      phone,
      message,
      showClose,
      buttonSize,
      buttonLabel,
      showDelaySeconds,
    },
  });

  return { ok: true };
};

export default function WhatsappSettings() {
  const {
    locale,
    phone,
    message,
    showClose,
    buttonSize,
    buttonLabel,
    showDelaySeconds,
  } = useLoaderData<LoaderData>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const [draftPhone, setDraftPhone] = useState(phone);
  const [draftMessage, setDraftMessage] = useState(message);
  const [draftShowClose, setDraftShowClose] = useState(showClose);
  const [draftButtonSize, setDraftButtonSize] = useState(buttonSize);
  const [draftButtonLabel, setDraftButtonLabel] = useState(buttonLabel);
  const [draftShowDelaySeconds, setDraftShowDelaySeconds] = useState(
    Math.max(0, showDelaySeconds),
  );

  useEffect(() => {
    if (fetcher.data?.ok) {
      shopify.toast.show(t(locale, "toastSaved"));
    }
  }, [fetcher.data?.ok, locale, shopify]);

  const errorMessage =
    fetcher.data && "error" in fetcher.data
      ? String(fetcher.data.error ?? "")
      : "";
  const isMedium = draftButtonSize === "M";
  const previewLabel = draftButtonLabel || "Bei WhatsApp schreiben";

  return (
    <s-page heading={t(locale, "pageTitle")}>
      <s-section heading={t(locale, "sectionTitle")}>
        <s-paragraph>{t(locale, "sectionDescription")}</s-paragraph>
        <fetcher.Form method="post">
          <div style={{ display: "grid", gap: "16px", maxWidth: "760px" }}>
            <label>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                {t(locale, "phoneLabel")}
              </div>
              <input
                name="phone"
                value={draftPhone}
                onChange={(event) => setDraftPhone(event.target.value)}
                placeholder="z.B. +49 171 1234567"
                style={{ width: "100%", padding: "8px" }}
              />
              <div style={{ fontSize: "12px", color: "#6d7175" }}>
                {t(locale, "phoneHelper")}
              </div>
            </label>
            <div
              style={{
                display: "flex",
                gap: "28px",
                alignItems: "flex-start",
              }}
            >
              <label style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{t(locale, "messageLabel")}</span>
                  <button
                    type="button"
                    title={t(locale, "messageInfo")}
                    onClick={() => window.alert(t(locale, "messageInfo"))}
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: "1px solid #c9cccf",
                      background: "#f6f6f7",
                      color: "#202223",
                      fontSize: "12px",
                      lineHeight: "1",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    aria-label={t(locale, "messageInfo")}
                  >
                    i
                  </button>
                </div>
                <textarea
                  name="message"
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  rows={4}
                  style={{ width: "100%", padding: "8px" }}
                />
              </label>
              <div style={{ minWidth: "240px" }}>
                
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: "220px",
                      background: "#0b0b0b",
                      borderRadius: "26px",
                      padding: "10px",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div
                      style={{
                        background: "#e5ddd5",
                        borderRadius: "20px",
                        padding: "10px",
                        position: "relative",
                        minHeight: "300px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                        background: "#f0f0f0",
                        color: "#1f1f1f",
                          borderRadius: "12px",
                          padding: "6px 10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                          background: "#bdbdbd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                          }}
                        >
                          W
                        </div>
                        <span>{draftPhone || "+491711234567"}</span>
                      </div>
                      <div style={{ flex: 1 }} />
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            border: "1px solid #d3d5d7",
                            borderRadius: "14px",
                            padding: "8px 10px",
                            color: "#3c3c3c",
                            background: "#ffffff",
                            whiteSpace: "pre-wrap",
                            fontSize: "12px",
                            minHeight: "34px",
                          }}
                        >
                          {draftMessage}
                        </div>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "#25D366",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "14px",
                            lineHeight: "1",
                          }}
                          aria-label={t(locale, "sendAria")}
                        >
                          ➤
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 600, marginTop: "8px" }}>
              {t(locale, "appearanceTitle")}
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                name="showClose"
                checked={draftShowClose}
                onChange={(event) => setDraftShowClose(event.target.checked)}
              />
              <span>{t(locale, "showCloseLabel")}</span>
            </label>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                {t(locale, "buttonSizeLabel")}
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="radio"
                    name="buttonSize"
                    value="S"
                    checked={draftButtonSize === "S"}
                    onChange={() => setDraftButtonSize("S")}
                  />
                  <span>{t(locale, "buttonSizeS")}</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="radio"
                    name="buttonSize"
                    value="M"
                    checked={draftButtonSize === "M"}
                    onChange={() => setDraftButtonSize("M")}
                  />
                  <span>{t(locale, "buttonSizeM")}</span>
                </label>
              </div>
            </div>
            <label style={{ opacity: isMedium ? 1 : 0.6 }}>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                {t(locale, "buttonTextLabel")}
              </div>
              <input
                name="buttonLabel"
                value={draftButtonLabel}
                onChange={(event) => setDraftButtonLabel(event.target.value)}
                placeholder={t(locale, "buttonTextPlaceholder")}
                disabled={!isMedium}
                style={{ width: "100%", padding: "8px" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                {t(locale, "delayLabel")}
              </div>
              <input
                type="number"
                min={0}
                name="showDelaySeconds"
                value={draftShowDelaySeconds}
                onChange={(event) =>
                  setDraftShowDelaySeconds(Number(event.target.value || 0))
                }
                style={{ width: "100%", padding: "8px" }}
              />
            </label>
            <div style={{ maxWidth: "320px" }}>
              <div style={{ fontWeight: 600, marginBottom: "8px" }}>
                {t(locale, "previewButtonLabel")}
              </div>
              <div
                style={{
                  position: "relative",
                  height: "100px",
                  border: "1px solid #e1e3e5",
                  borderRadius: "12px",
                  background: "#f6f6f7",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "16px",
                    bottom: "16px",
                    width: isMedium ? "auto" : "52px",
                    height: "52px",
                  }}
                >
                  <div
                    style={{
                      width: isMedium ? "auto" : "52px",
                      height: "52px",
                      borderRadius: "999px",
                      background: "#25D366",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: isMedium ? "0 14px" : "0",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                    aria-label={t(locale, "whatsappAria")}
                  >
                    <svg
                      viewBox="0 0 32 32"
                      width="32"
                      height="32"
                      aria-hidden="true"
                    >
                      <path
                        fill="#ffffff"
                        d="M19.11 17.23c-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.71-1.33-1.59-1.48-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.11 2.82.14.18 1.93 2.95 4.68 4.14.65.28 1.15.45 1.54.58.65.21 1.24.18 1.71.11.52-.08 1.58-.65 1.8-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.02 26.86h-.01a10.79 10.79 0 0 1-5.5-1.5l-.39-.23-4.08 1.07 1.09-3.98-.25-.41a10.76 10.76 0 1 1 9.14 5.05zm0-20.32a9.56 9.56 0 0 0-8.14 14.55l.41.66-.64 2.34 2.41-.63.64.38a9.55 9.55 0 1 0 5.32-17.3z"
                      />
                    </svg>
                    {isMedium && <span>{previewLabel}</span>}
                  </div>
                  {draftShowClose && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        width: "22px",
                        height: "22px",
                        borderRadius: "999px",
                        background: "#ffffff",
                        color: "#111111",
                        border: "1px solid rgba(0,0,0,0.15)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        lineHeight: "1",
                      }}
                    >
                      ×
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <s-button type="submit" variant="primary">
                {t(locale, "saveButton")}
              </s-button>
            </div>
          </div>
        </fetcher.Form>
        {fetcher.data?.ok === false && errorMessage && (
          <s-paragraph tone="critical">{errorMessage}</s-paragraph>
        )}
      </s-section>
    </s-page>
  );
}
