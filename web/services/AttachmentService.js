/**
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const botName = require('../../package.json').name;
const MAX_FILE_SIZE = 5000000;

export default class AttachmentService {
  constructor(bdk) {
    this.bdk = bdk;
  }

  /**
   * Create botAction for postAttachmentTimeline
   *
   * @param {string} f - file being uploaded
   * @param {string} selectedChatter
   */
  async postAttachment(f, selectedChatter) {
    if (f.size > MAX_FILE_SIZE) {
      throw Error('File size is too large');
    }

    const base64String = await this._getBase64String(f);
    const postAttachment = {
      name: 'postAttachmentTimeline',
      botId: botName,
      roomId: this.bdk.getRoomId(),
      isPending: true,
      parameters: [
        { name: 'timelineBotAttachment', value: base64String },
        { name: 'fileName', value: f.name },
        { name: 'fileType', value: f.type },
        { name: 'userName', value: this.bdk.getUserFullName() },
        { name: 'selectedChatter', value: selectedChatter },
      ],
    };

    await this.bdk.createBotAction(postAttachment);
  }

  /**
   * Turn file into base64 string
   *
   * @param {String} file - file being uploaded
   * @returns {Promise} resolves to file converted to base64 string
   */
  _getBase64String(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = new Buffer(reader.result).toString('base64');
        resolve(base64data);
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}
