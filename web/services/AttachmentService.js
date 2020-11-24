
const botName = require('../../package.json').name;
const MAX_FILE_SIZE = 5000000;

export default class MessageService {
  constructor(bdk) {
    this.bdk = bdk;
    this.roomId = bdk.getRoomId();
  }

  /**
   * Create botAction for postAttachmentTimeline
   *
   * @param {string} f - file being uploaded
   */
  postAttachment(f, selectedChatter) {
    if (f.size > MAX_FILE_SIZE) {
      throw Error('File size is too large');
    }

    getBase64(f)
      .then((base64String) => {
        const postAttachment = {
          name: 'postAttachmentTimeline',
          botId: botName,
          roomId: this.bdk.getRoomId(),
          isPending: true,
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
              value: this.bdk.getUserFullName(),
            },
            {
              name: 'selectedChatter',
              value: selectedChatter,
            },
          ],
        };

        console.log(postAttachment)
        this.bdk.createBotAction(postAttachment);
      })
      .catch((err) => this.bdk.log.error(err));
  }
}

/**
 * Turn file into base64 string
 *
 * @param {String} file - file being uploaded
 * @returns {String} file converted to base64 string
 */
function getBase64(file) {
  console.log(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const base64data = new Buffer(reader.result).toString('base64');
      console.log(base64data)
      resolve(base64data);
    };
    reader.onerror = (error) => {
      reject('getBase64 Error: ', error);
    };
  });
}