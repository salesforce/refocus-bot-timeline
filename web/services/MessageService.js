/**
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

export default class MessageService {
  constructor(bdk) {
    this.bdk = bdk;
  }

  async sendMessage(message, user) {
    const eventType = {
      type: 'Comment',
      user,
      join: true,
    };

    await this.bdk.createEvents(this.bdk.getRoomId(), message, eventType);
  }
}
