export type WhatsAppWebhookEvent = {
  object: "whatsapp_business_account";
  entry: WhatsAppEntry[];
};

export type WhatsAppEntry = {
  id: string;
  changes: WhatsAppChange[];
};

export type WhatsAppChange = {
  field: "messages";
  value: WhatsAppValue;
};

export type WhatsAppValue = {
  messaging_product: "whatsapp";
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
};

export type WhatsAppContact = {
  profile: { name: string };
  wa_id: string;
};

export type WhatsAppMessage =
  | TextMessage
  | ImageMessage
  | AudioMessage
  | DocumentMessage
  | InteractiveMessage
  | ReactionMessage
  | UnsupportedMessage;

type BaseMessage = {
  id: string;
  from: string;
  timestamp: string;
  context?: { from: string; id: string };
};

export type TextMessage = BaseMessage & {
  type: "text";
  text: { body: string };
};

export type ImageMessage = BaseMessage & {
  type: "image";
  image: { id: string; mime_type: string; sha256: string; caption?: string };
};

export type AudioMessage = BaseMessage & {
  type: "audio";
  audio: { id: string; mime_type: string; sha256: string; voice?: boolean };
};

export type DocumentMessage = BaseMessage & {
  type: "document";
  document: { id: string; mime_type: string; sha256: string; filename: string };
};

export type InteractiveMessage = BaseMessage & {
  type: "interactive";
  interactive:
    | { type: "button_reply"; button_reply: { id: string; title: string } }
    | { type: "list_reply"; list_reply: { id: string; title: string; description?: string } };
};

export type ReactionMessage = BaseMessage & {
  type: "reaction";
  reaction: { message_id: string; emoji: string };
};

export type UnsupportedMessage = BaseMessage & {
  type: "unsupported" | string;
};

export type WhatsAppStatus = {
  id: string;
  recipient_id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  conversation?: { id: string; origin: { type: string } };
  pricing?: { billable: boolean; pricing_model: string; category: string };
  errors?: { code: number; title: string; message: string }[];
};
