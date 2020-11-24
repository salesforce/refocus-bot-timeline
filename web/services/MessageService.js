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
