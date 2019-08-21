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

const createChannelMessage = (blocks) => ({
  response_type: 'in_channel',
  blocks,
});

const createErrorMessage = text => {
  const titleText = 'Oops, something went wrong :thinking_face:';
  const color = 'danger';
  return createPrivateMessage(titleText, color, text);
};

const createSuccessMessage = text => {
  const titleText = 'Yeah! Operation Sucessful :grin:';
  const color = 'good';
  return createPrivateMessage(titleText, color, text);
};

const simpleRow = (rowText) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: rowText,
  }
});

const dividerRow = () => ({
  type: 'divider',
})

const rowWithButton = (rowText, buttonText, buttonValue) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: rowText,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: buttonText,
    },
    value: buttonValue,
  }
});

const slackMessages = {
  createPrivateMessage,
  createChannelMessage,
  createErrorMessage,
  createSuccessMessage,
  blockElements: {
    simpleRow,
    rowWithButton,
    dividerRow,
  },
};


const formatHour = hour => {
  if (hour.length === 2) {
    return `${hour}:00`;
  }

  if (hour.length === 4) {
    return `${hour.substr(0, 2)}:${hour.substr(2)}`;
  }

  return hour;
};

module.exports = { slackMessages, formatHour,};
