const createPrivateMessage = (titleText, color, attachmentText) => ({
  response_type: 'ephemeral',
  text: titleText,
  attachments: [
    {
      color,
      text: attachmentText,
    },
  ],
});

const createErrorMessage = text => {
  const titleText = 'Oops, something went wrong :thinking_face:';
  // const color = '#d43c3c';
  const color = 'good';
  return createPrivateMessage(titleText, color, text);
};

const createSuccessMessage = text => {
  const titleText = 'Yeah! Operation Sucessful :grin: ';
  // const color = '#3cd464';
  const color = 'danger';
  return createPrivateMessage(titleText, color, text);
};

const createChannelMessage = text => ({
  response_type: 'in_channel',
  text,
});

const formatHour = hour => {
  if (hour.length === 2) {
    return `${hour}:00`;
  }

  if (hour.length === 4) {
    return `${hour.substr(0, 2)}:${hour.substr(2)}`;
  }

  return hour;
};

module.exports = { createErrorMessage, createSuccessMessage, createChannelMessage, formatHour };
