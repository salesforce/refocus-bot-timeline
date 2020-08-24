/**
 * Turn file into base64 string
 *
 * @param {String} file - file being uploaded
 * @returns {String} file converted to base64 string
 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const base64data = new Buffer(reader.result).toString('base64');
      resolve(base64data);
    };
    reader.onerror = (error) => {
      reject('getBase64 Error: ', error);
    };
  });
}

/**
 * Create botAction for newCase
 *
 * @param {string} f - file being uploaded
 * @param {object} bdk - reference to bdk to get information and post action.
 * @param {string} botName
 * @param {string} selectedChatter - selected salesforce org to post to.
 */
function postNewAttachment(f, bdk, botName, selectedChatter) {
  getBase64(f)
    .then((base64String) => {
      const postAttachment = {
        name: 'postAttachmentTimeline',
        botId: botName,
        roomId: bdk.getRoomId(),
        isPending: true,
        // parameters need to match parameters in action in package.json
        parameters: [
          {
            name: 'timelineBotAttachment',
            value: base64String,
          },
          {
            name: 'fileName',
            value: f.name,
          },
          {
            name: 'fileType',
            value: f.type,
          },
          {
            name: 'userName',
            value: bdk.getUserFullName(),
          },
          {
            name: 'selectedChatter',
            value: selectedChatter,
          },
        ],
      };
      bdk.createBotAction(postAttachment);
    })
    .catch((err) => bdk.log.error(err));
}

export default postNewAttachment;
