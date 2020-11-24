
export default class MessageService {
  constructor(bdk) {
    this.bdk = bdk;
    this.roomId = bdk.getRoomId();
  }

  async sendMessage(message, user) {
    const eventType = {
      type: 'Comment',
      user,
      join: true,
    };

    await this.bdk.createEvents(this.roomId, message, eventType);
  }
}
