import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  getDefaultMessage,
  getLocaleFromRequest,
  t,
  type Locale,
} from "../i18n";

type LoaderData = {
  locale: Locale;
  phone: string;
  message: string;
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
    update: { phone?: string; message?: string };
    create: { shop: string; phone?: string; message?: string };
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
  } satisfies LoaderData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const rawPhone = (formData.get("phone")?.toString() ?? "").trim();
  const phone = rawPhone.replace(/[^0-9]/g, "");
  const message = (formData.get("message")?.toString() ?? "").trim();

  await prismaClient.whatsappSettings.upsert({
    where: { shop: session.shop },
    update: { phone, message },
    create: { shop: session.shop, phone, message },
  });

  return { ok: true };
};

export default function WhatsappSettings() {
  const { locale, phone, message } = useLoaderData<LoaderData>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const [draftPhone, setDraftPhone] = useState(phone);
  const [draftMessage, setDraftMessage] = useState(message);

  useEffect(() => {
    if (fetcher.data?.ok) {
      shopify.toast.show(t(locale, "toastSaved"));
    }
  }, [fetcher.data?.ok, locale, shopify]);

  const errorMessage =
    fetcher.data && "error" in fetcher.data
      ? String(fetcher.data.error ?? "")
      : "";

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
                placeholder="z.B. 49 171 1234567"
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
