import {
  Channel as BaseChannel,
  LiteralStringForUnion,
  StreamChat,
} from "stream-chat";

export type TranscriptionLayerId = "edit" | "annotate" | "review";

export type AttachmentType = Record<string, unknown>;
export type ChannelType = Record<string, unknown>;
export type CommandType = LiteralStringForUnion;
export type EventType = Record<string, unknown>;
export type MessageType = Record<string, unknown>;
export type ReactionType = Record<string, unknown>;
export type UserType = { email: string; layerIds: TranscriptionLayerId[] };

export type Channel = BaseChannel<
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  MessageType,
  ReactionType,
  UserType
>;

export const chatClient = StreamChat.getInstance<
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  MessageType,
  ReactionType,
  UserType
>(process.env.REACT_APP_STREAM_CHAT_API_KEY);
