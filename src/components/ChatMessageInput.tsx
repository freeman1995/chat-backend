import React from "react";
import { FileUploadButton, ImageDropzone } from "react-file-utils";
import {
  ChatAutoComplete,
  EmojiPicker,
  Tooltip,
  UploadsPreview,
  useChannelStateContext,
  useComponentContext,
  useMessageInputContext,
  CooldownTimer as DefaultCooldownTimer,
} from "stream-chat-react";
import styled, { css } from "styled-components/macro";
import { ifProp, theme } from "styled-tools";

import {
  AttachmentIcon,
  EmojiIcon,
  MessageSendIcon,
} from "./icons";

const Container = styled.div`
  background-color: #fff;
  border-top: 1px solid ${theme("messageInput.containerBorderColor")};
  padding: 15px;

  textarea {
    font-size: 14px;
    line-height: 16px;
    color: ${theme("messageInput.inputTextColor")};
    height: 28px;
    box-shadow: none !important;
    border: none !important;

    ::placeholder {
      font-style: italic;
      color: ${theme("messageInput.inputPlaceholderColor")};
    }
  }
`;

const MessageInputContainer = styled.div<{ isActive: boolean }>`
  border: 1px solid
    ${ifProp(
      "isActive",
      theme("messageInput.inputBorderColorActive"),
      theme("messageInput.inputBorderColor")
    )};
  border-radius: 2px;
  transition: border-color 350ms ease-out;
`;

const ChatAutoCompleteWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MessageSendButton = styled(MessageSendIcon)<{ $isActive: boolean }>`
  margin-right: 8px;
  color: ${theme("messageInput.sendButtonColor")};
  transition: color 350ms ease-out;

  ${ifProp(
    "$isActive",
    css`
      color: ${theme("messageInput.sendButtonActiveColor")};
      cursor: pointer;
    `
  )};
`;

const MessageInputToolBox = styled.div`
  display: flex;
  align-items: center;
  padding: 7px 10px;
  background-color: ${theme("messageInput.toolBoxBackgroundColor")};
`;

const MessageInputToolTooltip = styled(Tooltip)`
  position: absolute;
  left: 5px;
  right: unset;
  visibility: hidden;
  bottom: 100%;
  width: auto;
  color: ${theme("messageInput.toolTooltipTextColor")};
  background-color: ${theme("messageInput.toolTooltipBackgroundColor")};
  border-radius: 2px;
  padding: 5px 10px;
  white-space: nowrap;
`;

const MessageInputToolWrapper = styled.div`
  position: relative;

  &:hover {
    ${MessageInputToolTooltip} {
      visibility: visible;
    }
  }
`;

const MessageInputTool = styled.span`
  svg {
    width: 14px;
    height: 14px;
    color: ${theme("messageInput.toolColor")};
    transition: color 250ms ease-out;
  }

  &:hover {
    svg {
      color: ${theme("messageInput.toolActiveColor")};
    }
  }

  label {
    display: flex;
  }

  .rfu-file-upload-button {
    position: static !important;
  }
`;

export const ChatMessageInput = () => {
  const { acceptedFiles, multipleUploads } = useChannelStateContext();

  const {
    closeEmojiPicker,
    cooldownInterval,
    cooldownRemaining,
    emojiPickerIsOpen,
    handleEmojiKeyDown,
    handleSubmit,
    isUploadEnabled,
    maxFilesLeft,
    openEmojiPicker,
    setCooldownRemaining,
    uploadNewFiles,
    text,
    imageUploads,
    fileUploads,
  } = useMessageInputContext();

  const { CooldownTimer = DefaultCooldownTimer } = useComponentContext();

  return (
    <Container className="str-chat__small-message-input__wrapper">
      <ImageDropzone
        accept={acceptedFiles}
        disabled={!isUploadEnabled || maxFilesLeft === 0 || !!cooldownRemaining}
        handleFiles={uploadNewFiles}
        maxNumberOfFiles={maxFilesLeft}
        multiple={multipleUploads}
      >
        <div className={`str-chat__small-message-input`}>
          <div className="str-chat__small-message-input--textarea-wrapper">
            {isUploadEnabled && <UploadsPreview />}

            <MessageInputContainer isActive={!!text.length}>
              <ChatAutoCompleteWrapper>
                <ChatAutoComplete />

                {!cooldownRemaining && (
                  <MessageSendButton
                    onClick={handleSubmit}
                    $isActive={
                      !!(
                        text.length ||
                        Object.values(imageUploads).length ||
                        Object.values(fileUploads).length
                      )
                    }
                  />
                )}
              </ChatAutoCompleteWrapper>

              <MessageInputToolBox>
                {cooldownRemaining ? (
                  <div className="str-chat__input-small-cooldown">
                    <CooldownTimer
                      cooldownInterval={cooldownInterval}
                      setCooldownRemaining={setCooldownRemaining}
                    />
                  </div>
                ) : (
                  <>
                    <MessageInputToolWrapper className="str-chat__emojiselect-wrapper">
                      <MessageInputToolTooltip>
                        {emojiPickerIsOpen
                          ? "Close emoji picker"
                          : "Open emoji picker"}
                      </MessageInputToolTooltip>

                      <MessageInputTool
                        className="str-chat__small-message-input-emojiselect"
                        onClick={
                          emojiPickerIsOpen ? closeEmojiPicker : openEmojiPicker
                        }
                        onKeyDown={handleEmojiKeyDown}
                        role="button"
                        tabIndex={0}
                      >
                        <EmojiIcon />
                      </MessageInputTool>
                    </MessageInputToolWrapper>

                    {isUploadEnabled && (
                      <MessageInputToolWrapper
                        className="str-chat__fileupload-wrapper"
                        data-testid="fileinput"
                      >
                        <MessageInputToolTooltip>
                          {maxFilesLeft
                            ? "Attach files"
                            : "You've reached the maximum number of files"}
                        </MessageInputToolTooltip>

                        <MessageInputTool className="str-chat__small-message-input-fileupload">
                          <FileUploadButton
                            accepts={acceptedFiles}
                            disabled={maxFilesLeft === 0}
                            handleFiles={uploadNewFiles}
                            multiple={multipleUploads}
                          >
                            <AttachmentIcon />
                          </FileUploadButton>
                        </MessageInputTool>
                      </MessageInputToolWrapper>
                    )}
                  </>
                )}
              </MessageInputToolBox>
            </MessageInputContainer>

            <EmojiPicker small />
          </div>
        </div>
      </ImageDropzone>
    </Container>
  );
};
