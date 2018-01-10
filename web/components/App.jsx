import PropTypes from 'prop-types';
const moment = require('moment');
const React=require('react');
const env = process.env.NODE_ENV || 'dev';
const config = require('../../config.js')[env];
const bdk = require('@salesforce/refocus-bdk')(config);
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
      filter: 'all',
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
    this.setState({ currentText: '' });
    bdk.createEvents(this.state.roomId, this.state.currentText);
  }

  render(){
    const { response } = this.state;
    const buttonHeaderClass = 'slds-size_1-of-1 slds-text-align_center' +
      ' slds-docked-composer__header';

    const footerClass = 'slds-docked-composer__footer slds-grid slds-form' +
      ' slds-form_stacked slds-p-horizontal_medium slds-m-bottom_small';

    return (
      <div>
        <div className={buttonHeaderClass}>
          <ul className="slds-button-group-list">
            <li>
              <button
                className={'slds-button ' +
                  (this.state.filter === 'all' ?
                    'slds-button_brand' :
                    'slds-button_neutral')}
                onClick={() => this.filterType('all')}>
                All
              </button>
            </li>
            <li>
              <button
                className={'slds-button ' +
                  (this.state.filter === 'comments' ?
                    'slds-button_brand' :
                    'slds-button_neutral')}
                onClick={() => this.filterType('comments')}>
                Comments
              </button>
            </li>
            <li>
              <button
                className={'slds-button ' +
                  (this.state.filter === 'events' ?
                    'slds-button_brand' :
                    'slds-button_neutral')}
                onClick={() => this.filterType('events')}>
                Events
              </button>
            </li>
            <li>
              <button
                className={'slds-button ' +
                  (this.state.filter === 'users' ?
                    'slds-button_brand' :
                    'slds-button_neutral')}
                onClick={() => this.filterType('users')}>
                Users
              </button>
            </li>
          </ul>
        </div>
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
            return (
              <li className="slds-chat-listitem" key={event.id}>
                <div className="slds-chat-message">
                  <div className="slds-chat-message__body slds-chat_past">
                    <div className="slds-chat-message__meta">
                      <b>User</b> • {event.createdAt}</div>
                    <div className="slds-chat-message__text">
                      <span>{event.log}</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className={footerClass}>
          <div className="slds-size_1-of-1 slds-form-element slds-col">
            <div className="slds-form-element__control slds-p-around_xx-small">
              <input
                id="chat"
                type="search"
                className="slds-input"
                placeholder="Type Message"
                value={this.state.currentText}
                onChange={this.chatChange}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.sendChat();
                  }
                }}/>
            </div>
          </div>
          <div className="slds-col slds-p-around_xx-small">
            <button
              className="slds-button slds-button_brand"
              onClick={() => this.sendChat()}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes={
  roomId: PropTypes.number,
  response: PropTypes.object,
};

module.exports=App;
