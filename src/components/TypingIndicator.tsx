import React from "react";
import {
  useChannelStateContext,
  useChatContext,
  useTypingContext,
} from "stream-chat-react";
import styled from "styled-components/macro";
import { palette } from "styled-tools";

import {
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  MessageType,
  ReactionType,
  UserType,
} from "../chat-client";

const Container = styled.div`
  display: flex;
  max-width: 100%;
  position: absolute;
  z-index: 999;
  bottom: 5px;
  left: 5px;
  font-size: 12px;
  font-weight: 500;
  color: ${palette("navy", 0)};
`;

/**
 * TypingIndicator lists users currently typing, it needs to be a child of Channel component
 */
export const TypingIndicator = () => {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const { typing = {} } =
    useTypingContext<
      AttachmentType,
      ChannelType,
      CommandType,
      EventType,
      MessageType,
      ReactionType,
      UserType
    >();
  const currentUser = client.user;

  if (channel?.getConfig()?.typing_events === false || !currentUser) {
    return null;
  }

  const typingInChannel = Object.values(typing).filter(
    ({ parent_id, user }) => !!user && user.id !== currentUser.id && !parent_id
  );
  const lastTypingUser = typingInChannel[typingInChannel.length - 1].user;

  if (!lastTypingUser) {
    return null;
  }

  return <Container>{lastTypingUser.email} is typing...</Container>;
};
