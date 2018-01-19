import PropTypes from 'prop-types';
const moment = require('moment');
const React=require('react');
const env = process.env.NODE_ENV || 'dev';
const config = require('../../config.js')[env];
const bdk = require('@salesforce/refocus-bdk')(config);
const FilterHeader = require('./FilterHeader.jsx');
const EventMessage = require('./EventMessage.jsx');
const UserMessage = require('./UserMessage.jsx');
const ChatMessage = require('./ChatMessage.jsx');
const ChatBox = require('./ChatBox.jsx');
import './chat.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      roomId: this.props.roomId,
      response: this.props.response
        .sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt))),
      currentText: '',
      scroll: false,
      filter: 'All',
    };
    this.closeToast = this.closeToast.bind(this);
    this.filterType = this.filterType.bind(this);
    this.chatChange = this.chatChange.bind(this);
    this.sendChat = this.sendChat.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const eventLog = this.state.response.concat(nextProps.response);
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
      this.setState({ currentText: '' });
      const eventType = {
        'type': 'Comment',
      };
      bdk.createEvents(this.state.roomId, this.state.currentText, eventType);
    }
  }

  render(){
    const { response } = this.state;

    return (
      <div>
        <FilterHeader
          filter={ this.state.filter }
          changeType={ this.filterType } />
        <ul className="slds-chat-list"
          ref={(elem) => {
            this.container = elem;
          }}>
          <li>
            <div className="slds-chat-bookend">
              Start of timeline for&nbsp;<b>Room #{this.state.roomId}</b>
            </div>
          </li>
          {response.map((event) => {
            if ((this.state.filter === 'All') ||
              ((event.context) &&
                (event.context.type === this.state.filter))
            ) {
              if ((event.context) && (event.context.type === 'Event')) {
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
          sendChat={this.sendChat} />
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
