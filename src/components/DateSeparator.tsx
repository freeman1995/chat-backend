import React from "react";
import { isDayOrMoment, useTranslationContext } from "stream-chat-react";
import styled from "styled-components/macro";

const Container = styled.div`
  padding: 20px 0;
`;

export type DateSeparatorProps = {
  /** The date to format */
  date: Date;
  /** Override the default formatting of the date. This is a function that has access to the original date object. */
  formatDate?: (date: Date) => string;
  /** If following messages are not new */
  unread?: boolean;
};

export const DateSeparator = ({
  date,
  formatDate,
  unread,
}: DateSeparatorProps) => {
  const { t, tDateTimeParser } = useTranslationContext();
  const parsedDate = tDateTimeParser(date.toISOString());
  const formattedDate = formatDate
    ? formatDate(date)
    : isDayOrMoment(parsedDate)
    ? parsedDate.calendar()
    : parsedDate;

  return (
    <Container className="str-chat__date-separator">
      <hr className="str-chat__date-separator-line" />
      <div className="str-chat__date-separator-date">
        {unread ? `${t("New")} - ${formattedDate}` : formattedDate}
      </div>
      <hr className="str-chat__date-separator-line" />
    </Container>
  );
};
