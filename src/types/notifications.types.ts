export type NotificationType =
  | "system"
  | "settings"
  | "payment"
  | "invoice"
  | "loyalty"
  | "chat"
  | "propertyrejected";

export type NotificationSourceType = "system" | "client";

export type NotificationStatusType = "deleted" | "pending" | "read";

export type NotificationObjectType = {
  id: number;
  profileid: number;
  type: NotificationType;
  title: string;
  notification: string;
  source: NotificationSourceType;
  createdat?: string;
  deleted?: boolean;
  deletedat?: string;
  status: NotificationStatusType;
  meta: any;
  profile: {
    firstname: string;
    lastname: string;
  };
};
