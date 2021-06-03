import React from "react";
import { useChannelStateContext } from "stream-chat-react";
import styled from "styled-components/macro";
import { Tooltip } from "@blueprintjs/core";
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

const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  padding: 14px 15px;
  color: ${theme("channelHeader.textColor")};
  border-bottom: 1px solid ${theme("channelHeader.borderBottomColor")};
  background-color: #fff;
  cursor: pointer;
`;

const MemberListTooltip = styled(Tooltip)`
  .bp3-popover.bp3-tooltip {
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 #000000;

    .bp3-popover-content {
      border-radius: 4px;
      padding: 10px;
      background-color: #fff;
      max-height: 300px;
      overflow-y: auto;
    }

    .bp3-popover-arrow-fill {
      fill: #fff;
    }
  }
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  color: ${theme("channelHeader.memberTextColor")};
  font-weight: 400;
  font-size: 16px;
  padding: 5px;
  min-width: 160px;
`;

const MemberStatus = styled.div<{ isOnline?: boolean }>`
  width: 12px;
  height: 12px;
  margin-right: 6px;
  border-radius: 50%;
  background-color: ${ifProp(
    "isOnline",
    theme("channelHeader.memberStatusOfflineColor"),
    theme("channelHeader.memberStatusOnlineColor")
  )};
`;

export const ChannelHeader = () => {
  const { members = {}, watchers = {} } =
    useChannelStateContext<
      AttachmentType,
      ChannelType,
      CommandType,
      EventType,
      MessageType,
      ReactionType,
      UserType
    >();

  const memberCount = Object.values(members).length;
  const onlineCount = Object.values(watchers).length;

  return (
    <Container>
      <MemberListTooltip
        hoverCloseDelay={250}
        usePortal={false}
        position="bottom"
        content={
          <>
            {Object.values(members)
              .sort(({ user }) => (watchers[user?.id ?? ""] ? -1 : 1))
              .map(({ user_id, user }) => (
                <Member key={user_id}>
                  <MemberStatus isOnline={!!watchers[user?.id ?? ""]} />
                  {user?.email}
                </Member>
              ))}
          </>
        }
      >
        {!!memberCount && `${memberCount} in your team, ${onlineCount} online`}
      </MemberListTooltip>
    </Container>
  );
};
