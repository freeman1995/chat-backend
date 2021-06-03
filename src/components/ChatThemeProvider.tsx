import React, { ReactNode } from "react";
import { ThemeProvider } from "styled-components/macro";

export interface ChatTheme {
  channelHeader: {
    textColor: string;
    borderBottomColor: string;
    member: {
      textColor: string;
      statusIndicator: {
        onlineColor: string;
        offlineColor: string;
      };
    };
  };
  message: {
    reactionSelectorBorderColor: string;
    optionsBoxBorderColor: string;
    textColor: {
      currentUser: string;
      user: string;
      admin: string;
    };
    backgroundColor: {
      currentUser: string;
      user: string;
      admin: string;
    };
  };
  avatar: {
    backgroundColor: {
      currentUser: string;
      user: string;
    };
    textColor: {
      currentUser: string;
      user: string;
    };
  };
  messageInput: {
    containerBorderColor: string;
    input: {
      textColor: string;
      placeholderColor: string;
      borderColor: string;
      borderActiveColor: string;
    };
    sendButton: {
      color: string;
      activeColor: string;
    };
    toolBox: {
      backgroundColor: string;
      tool: {
        color: string;
        activeColor: string;
        tooltip: {
          textColor: string;
          backgroundColor: string;
        };
      };
    };
  };
  typingIndicatorTextColor: string;
}

interface ChatThemeProviderProps {
  children: ReactNode;
  theme: ChatTheme;
}

export const ChatThemeProvider = ({
  theme,
  children,
}: ChatThemeProviderProps) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
