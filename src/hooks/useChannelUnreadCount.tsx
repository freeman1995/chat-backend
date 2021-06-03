import { useEffect, useState } from "react";
import { Event as ChatEvent } from "stream-chat/dist/types/types";

import { chatClient, Channel } from "../chat-client";

export const useChannelUnreadCount = (channelId?: string, userId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    const onConnectionChanged = (e: ChatEvent) => {
      setIsConnected(!!e.online);
    };

    chatClient.on("connection.changed", onConnectionChanged);

    return () => {
      chatClient.off("connection.changed", onConnectionChanged);
    };
  }, []);

  useEffect(() => {
    let channel: Channel | null = null;

    const onChatNotification = (event: ChatEvent) =>
      setTotalUnreadCount(event.unread_count ?? 0);

    const listenToChatNotifications = async () => {
      if (!channelId || !userId || !isConnected) {
        return;
      }

      channel = chatClient.channel("messaging", channelId);

      await channel.create();
      await channel.addMembers([userId]);

      channel.on("notification.mark_read", onChatNotification);
      channel.on("notification.message_new", onChatNotification);
    };

    listenToChatNotifications();

    return () => {
      channel?.off("notification.mark_read", onChatNotification);
      channel?.off("notification.message_new", onChatNotification);
    };
  }, [channelId, userId, isConnected]);

  return totalUnreadCount;
};
