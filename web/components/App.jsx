import PropTypes from 'prop-types';
const moment = require('moment');
const _ = require('lodash');
const React=require('react');
const { env } = require('../../config.js');
const config = require('../../config.js')[env];
const bdk = require('@salesforce/refocus-bdk')(config);
const FilterHeader = require('./FilterHeader.jsx');
const EventMessage = require('./EventMessage.jsx');
const UserMessage = require('./UserMessage.jsx');
const ChatMessage = require('./ChatMessage.jsx');
const AttachmentMessage = require('./AttachmentMessage.jsx');
const ChatBox = require('./ChatBox.jsx');
import './chat.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      roomId: this.props.roomId,
      response: this.props.response
        .sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)))
        .filter((value, index, self) => {
          const dulplicates = _.filter(self.slice(0, index), ['id', value.id]);
          return  dulplicates.length === 0 ?
            value : false;
        }),
      currentText: '',
      scroll: false,
      filter: 'All',
      pendingMessage: false
    };
    this.closeToast = this.closeToast.bind(this);
    this.filterType = this.filterType.bind(this);
    this.chatChange = this.chatChange.bind(this);
    this.sendChat = this.sendChat.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let eventLog = this.state.response.concat(nextProps.response);
    eventLog = eventLog
      .sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)))
      .filter((value, index, self) => {
        const dulplicates = _.filter(self.slice(0, index), ['id', value.id]);
        return  dulplicates.length === 0 ?
          value : false;
      });
    this.setState({ response: eventLog });
    this.setState({ scroll: true });
  }

  componentDidUpdate() {
    if (this.state.scroll) {
      this.container.scrollTop = this.container.scrollHeight;
      this.setState({ scroll: false });
    }
  }

  closeToast(){
    this.setState({ message: '' });
  }

  filterType(type) {
    this.setState({ filter: type });
  }

  chatChange(e){
    this.setState({ currentText: e.target.value });
  }

  sendChat(){
    if (this.state.currentText !== '') {
      const eventType = {
        'type': 'Comment',
        'user': this.props.user,
        'join': true,
      };

      this.setState({ pendingMessage: true });
      bdk.createEvents(this.state.roomId, this.state.currentText, eventType)
        .then(() => {
          this.setState({
            pendingMessage: false,
            currentText: ''
          });
        });
    }
  }

  render(){
    const { response } = this.state;

    return (
      <div>
        <FilterHeader
          filter={ this.state.filter }
          changeType={ this.filterType } />
        <ul className='slds-chat-list'
          ref={(elem) => {
            this.container = elem;
          }}>
          <li>
            <div className='slds-chat-bookend'>
              Start of timeline for&nbsp;<b>Room #{this.state.roomId}</b>
            </div>
          </li>
          {response.map((event) => {
            const isAttachment = (this.state.filter === 'Attachment') &&
                  (event.context.type === 'Event') &&
                  (event.context.attachment);
            const isSelectedFilter = (event.context) &&
              (event.context.type === this.state.filter);

            if ((this.state.filter === 'All') ||
              (isSelectedFilter) ||
                (isAttachment)
            ) {
              if ((event.context) && (event.context.type === 'Event' ||
                event.context.type === 'RoomState') &&
                (!event.context.attachment)) {
                return (
                  <EventMessage
                    event={ event }
                    key={ event.id } />
                );
              }
              if ((event.context) && (event.context.type === 'User')) {
                return (
                  <UserMessage
                    event={ event }
                    key={ event.id } />
                );
              }
              if ((event.context) && (event.context.type === 'Event') &&
                  (event.context.attachment)) {
                return (
                  <AttachmentMessage
                    event={ event }
                    key={ event.id } />
                );
              }
              return (
                <ChatMessage
                  event={ event }
                  key={ event.id } />
              );
            }
            return (<div key={event.id}></div>);
          })}
        </ul>
        <ChatBox
          currentText={this.state.currentText}
          chatChange={this.chatChange}
          sendChat={this.sendChat}
          pendingMessage={this.state.pendingMessage}/>
      </div>
    );
  }
}

App.propTypes={
  roomId: PropTypes.number,
  response: PropTypes.array,
  user: PropTypes.object,
};

module.exports=App;
