import React from "react";
import { useMessageContext } from "stream-chat-react";
import styled, { css } from "styled-components/macro";
import { ifProp, theme } from "styled-tools";

import {
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  MessageType,
  ReactionType,
  UserType,
} from "../chat-client";
import { AdminAvatarIcon } from "./icons";

const baseAvatarCss = css`
  flex: 0 0 28px;
  height: 28px;
  margin-right: 10px;
`;

const UserAvatar = styled.div<{ isCurrentUser: boolean }>`
  ${baseAvatarCss};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  line-height: 12px;
  text-transform: uppercase;

  ${ifProp(
    "isCurrentUser",
    css`
      position: relative;
      background: ${theme("avatarBackgroundColor.currentUser")};
      color: ${theme("avatarTextColor.currentUser")};

      &:before {
        content: "";
        position: absolute;
        top: 1px;
        right: 1px;
        bottom: 1px;
        left: 1px;
        background-color: transparent;
        border-radius: 50%;
        border: 1px solid #fff;
      }
    `,
    css`
      background: ${theme("avatarBackgroundColor.user")};
      color: ${theme("avatarTextColor.user")};
    `
  )}
`;

const AdminAvatar = styled(AdminAvatarIcon)`
  ${baseAvatarCss}
`;

interface AvatarProps {
  className?: string;
}

export const Avatar = ({ className }: AvatarProps) => {
  const { isMyMessage, message } =
    useMessageContext<
      AttachmentType,
      ChannelType,
      CommandType,
      EventType,
      MessageType,
      ReactionType,
      UserType
    >();

  if (!message.user) {
    return null;
  }

  if (message.user.role === "admin") {
    return <AdminAvatar className={className} />;
  }

  return (
    <UserAvatar className={className} isCurrentUser={isMyMessage()}>
      {message.user.email.slice(0, 2)}
    </UserAvatar>
  );
};
