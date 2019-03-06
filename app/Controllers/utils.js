const createErrorMessage = text => ({
  response_type: 'ephemeral',
  text: 'Oops, something went wrong :thinking_face:',
  attachments: [
    {
      color: '#d43c3c',
      text,
    },
  ],
});

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

module.exports = { createErrorMessage, createChannelMessage, formatHour };
