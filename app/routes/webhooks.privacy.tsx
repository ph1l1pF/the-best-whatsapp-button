import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

type WhatsappSettingsDelegate = {
  deleteMany: (args: { where: { shop: string } }) => Promise<unknown>;
};

const prismaClient = db as typeof db & {
  whatsappSettings: WhatsappSettingsDelegate;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  if (topic === "shop/redact") {
    await prismaClient.session.deleteMany({ where: { shop } });
    await prismaClient.whatsappSettings.deleteMany({ where: { shop } });
  }

  return new Response();
};
