import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel as ChannelView,
  MessageList,
  Window,
  MessageInput,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import styled from "styled-components/macro";

import { chatClient, Channel } from "../chat-client";
import { ChannelHeader } from "./ChannelHeader";
import { ChatMessageInput } from "./ChatMessageInput";
import { ChatMessage } from "./ChatMessage";
import { DateSeparator } from "./DateSeparator";
import { TypingIndicator } from "./TypingIndicator";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;

  .str-chat-channel.messaging.str-chat {
    max-height: 100%;
    overflow: hidden;

    .str-chat__main-panel {
      padding: 0;

      .str-chat__list {
        padding: 0 !important;
      }
    }
  }

  .str-chat__li {
    display: flex;

    .avatar {
      visibility: hidden;
    }

    .visible-on-msg-hover {
      visibility: hidden;
      opacity: 0;
      transition: opacity 150ms ease-out;
    }

    &:hover .visible-on-msg-hover {
      visibility: visible;
      opacity: 1;
    }
  }

  .str-chat__li.str-chat__li--single,
  .str-chat__li.str-chat__li--bottom {
    padding-bottom: 20px;

    .avatar {
      visibility: visible;
    }
  }

  .str-chat__message.str-chat__message--deleted.deleted,
  .str-chat__message--me.str-chat__message--deleted {
    align-items: center !important;
    margin: 0;
  }
`;

interface ChannelChatProps {
  channelId: string;
}

export const ChannelChat = ({ channelId }: ChannelChatProps) => {
  const [channel, setChannel] = useState<Channel>();

  useEffect(() => {
    const init = async () => {
      const channel = chatClient.channel("messaging", channelId);
      await channel.watch();
      setChannel(channel);
    };

    init();

    return () => {
      channel?.stopWatching();
    };
  }, [channel, channelId]);

  return (
    <Container>
      <Chat client={chatClient}>
        <ChannelView
          channel={channel}
          Message={ChatMessage}
          DateSeparator={DateSeparator}
          TypingIndicator={TypingIndicator}
        >
          <Window>
            <ChannelHeader />
            <MessageList messageActions={["react", "delete"]} />
            <MessageInput Input={ChatMessageInput} />
          </Window>
        </ChannelView>
      </Chat>
    </Container>
  );
};
