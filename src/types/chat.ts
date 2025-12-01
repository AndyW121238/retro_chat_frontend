import type { User } from "@/types/entities";

export type MessageStatus = "pending" | "sent" | "failed";

export interface BaseMessage {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  status?: MessageStatus;
}

export interface DirectMessage extends BaseMessage {}

export interface ChannelMessage extends BaseMessage {}

export interface DirectMessageUser extends User {
  lastMessageContent: string;
  roomId: string;
}
