import React, { useRef } from "react";
import {
  messageHasAttachments,
  messageHasReactions,
  MessageInput,
  MessageText,
  Modal,
  useComponentContext,
  MessageDeleted as DefaultMessageDeleted,
  MessageTimestamp as DefaultMessageTimestamp,
  ReactionSelector as DefaultReactionSelector,
  ReactionsList as DefaultReactionList,
  useMessageContext,
} from "stream-chat-react";
import { MML } from "stream-chat-react/dist/components/MML";
import styled from "styled-components/macro";
import { theme } from "styled-tools";
import classNames from "classnames";

import { EmojiIcon, TrashIcon } from "./icons";
import { Avatar } from "./Avatar";
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
  padding: 0 15px 0 10px;

  .str-chat__reaction-selector {
    background-image: none;
    background-color: #fff;
    border: solid 1px ${theme("reactionSelectorBorderColor")};
    box-shadow: none;
    border-radius: 18px;
    padding: 8px 8px !important;
    height: unset;
    top: -40px;

    > ul {
      margin: 0;
    }
  }

  .str-chat__message-inner {
    margin-right: 0 !important;
    margin-left: 0 !important;
    min-width: 50px;

    .str-chat__message-text-inner {
      background: ${theme("messageBackgroundColor.user")};
      color: ${theme("messageColor.user")};
      border: none;
      padding: 8px 10px;
      border-radius: 10px !important;
      font-size: 12px !important;
      word-break: break-word;
    }

    .str-chat__message-actions-box {
      width: 120px;
    }
  }
  &.my-message {
    .str-chat__message-text-inner {
      background: ${theme("messageBackgroundColor.currentUser")};
      color: ${theme("messageColor.currentUser")};
    }
  }
  &.admin-message {
    .str-chat__message-text-inner {
      background: ${theme("messageBackgroundColor.admin")};
      color: ${theme("messageColor.admin")};
    }
  }

  .str-chat__message-attachment--img {
    border-radius: 10px !important;
  }

  .str-chat__message-simple-text-inner.str-chat__message-simple-text-inner--is-emoji
    p {
    line-height: inherit;
  }
`;

const MessageOptions = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(25%, -50%);
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border: solid 1px ${theme("messageOptionsBorderColor")};
  border-radius: 18px;
  background-color: #fff;

  svg {
    width: 12px;
    height: 12px;
    cursor: pointer;

    &:not(:last-of-type) {
      margin-right: 8px;
    }
  }
`;

export const ChatMessage = () => {
  const {
    additionalMessageInputProps,
    clearEditingState,
    editing,
    handleAction,
    handleDelete,
    handleRetry,
    isMyMessage,
    isReactionEnabled,
    message,
    reactionSelectorRef,
    showDetailedReactions,
    onReactionListClick,
  } =
    useMessageContext<
      AttachmentType,
      ChannelType,
      CommandType,
      EventType,
      MessageType,
      ReactionType,
      UserType
    >();

  const {
    Attachment,
    MessageDeleted = DefaultMessageDeleted,
    MessageTimestamp = DefaultMessageTimestamp,
    ReactionSelector = DefaultReactionSelector,
    ReactionsList = DefaultReactionList,
  } = useComponentContext<
    AttachmentType,
    ChannelType,
    CommandType,
    EventType,
    MessageType,
    ReactionType,
    UserType
  >();

  const messageWrapperRef = useRef<HTMLDivElement | null>(null);

  const hasAttachment = messageHasAttachments(message);
  const hasReactions = messageHasReactions(message);

  // @ts-ignore
  if (message.type === "message.read" || message.type === "message.date") {
    return null;
  }

  if (message.deleted_at || message.type === "deleted") {
    return <MessageDeleted message={message} />;
  }

  const className = classNames(
    `str-chat__message--${message.type}`,
    `str-chat__message--${message.status}`,
    message.text ? "str-chat__message--has-text" : "has-no-text",
    "str-chat__message",
    "str-chat__message-simple",
    {
      "my-message": isMyMessage(),
      "admin-message": message.user?.role === "admin",
      "str-chat__message--has-attachment": hasAttachment,
      "str-chat__message--with-reactions": hasReactions && isReactionEnabled,
      "pinned-message": message.pinned,
    }
  );

  return (
    <>
      {editing && (
        <Modal onClose={clearEditingState} open={editing}>
          <MessageInput
            clearEditingState={clearEditingState}
            message={message}
            {...additionalMessageInputProps}
          />
        </Modal>
      )}

      <Container className={className} key={message.id} ref={messageWrapperRef}>
        <Avatar />

        <div
          className="str-chat__message-inner"
          data-testid="message-inner"
          onClick={
            message.status === "failed" && message.errorStatusCode !== 403
              ? () => handleRetry(message)
              : undefined
          }
        >
          <>
            <MessageOptions className="visible-on-msg-hover">
              {isMyMessage() && <TrashIcon onClick={handleDelete} />}

              <EmojiIcon onClick={onReactionListClick} />
            </MessageOptions>

            {hasReactions && !showDetailedReactions && isReactionEnabled && (
              <ReactionsList
                own_reactions={message.own_reactions}
                reaction_counts={message.reaction_counts || undefined}
                reactions={message.latest_reactions}
                reverse
              />
            )}

            {showDetailedReactions && isReactionEnabled && (
              <ReactionSelector
                detailedView
                latest_reactions={message.latest_reactions}
                own_reactions={message.own_reactions}
                reaction_counts={message.reaction_counts || undefined}
                ref={reactionSelectorRef}
              />
            )}
          </>

          {message.attachments && (
            <Attachment
              actionHandler={handleAction}
              attachments={message.attachments}
            />
          )}
          {message.text && <MessageText />}
          {message.mml && (
            <MML
              actionHandler={handleAction}
              align={"left"}
              source={message.mml}
            />
          )}

          <div
            className={`str-chat__message-data str-chat__message-simple-data`}
          >
            {message.user && (
              <span className="str-chat__message-simple-name">
                {message.user.email}
                {message.user.role === "admin" && " from Verbit"}
              </span>
            )}

            <MessageTimestamp
              calendar={false}
              customClass="str-chat__message-simple-timestamp"
            />
          </div>
        </div>
      </Container>
    </>
  );
};
