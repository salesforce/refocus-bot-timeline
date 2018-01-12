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
    const buttonHeaderClass = 'slds-size_1-of-1 slds-text-align_center' +
      ' slds-docked-composer__header';
    const footerClass = 'slds-docked-composer__footer slds-grid slds-form' +
      ' slds-form_stacked slds-p-horizontal_medium slds-m-bottom_small';
    const svgIconClass = 'slds-icon_container slds-icon-utility-change_owner ' +
      'slds-chat-icon';
    const iconClass = 'slds-icon slds-m-bottom_xx-small slds-icon_xx-small';
    const iconPath = '../static/icons/utility-sprite/svg/symbols.svg';

    return (
      <div>
        <div className={buttonHeaderClass}>
          <ul className="slds-button-group-list">
            <li>
              <button
                className={'slds-button ' +
                  (this.state.filter === 'All' ?
                    'slds-button_brand' :
                    'slds-button_neutral')}
                onClick={() => this.filterType('All')}>
                All
              </button>
            </li>
            <li>
              <button
                className={'slds-button ' +
                  (this.state.filter === 'Comment' ?
                    'slds-button_brand' :
                    'slds-button_neutral')}
                onClick={() => this.filterType('Comment')}>
                Comments
              </button>
            </li>
            <li>
              <button
                className={'slds-button ' +
                  (this.state.filter === 'Event' ?
                    'slds-button_brand' :
                    'slds-button_neutral')}
                onClick={() => this.filterType('Event')}>
                Events
              </button>
            </li>
            <li>
              <button
                className={'slds-button ' +
                  (this.state.filter === 'User' ?
                    'slds-button_brand' :
                    'slds-button_neutral')}
                onClick={() => this.filterType('User')}>
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
            if ((this.state.filter === 'All') ||
              ((event.context) &&
                (event.context.type === this.state.filter))
            ) {
              if ((event.context) && (event.context.type === 'Event')) {
                return (
                  <li
                    className="slds-chat-listitem slds-chat-listitem_event"
                    key={event.id}>
                    <div className="slds-chat-event">
                      <div className="slds-chat-event__rule"></div>
                      <div className="slds-chat-event__body">
                        <span className={svgIconClass}>
                          <svg className={iconClass} aria-hidden="true">
                            <use
                              xlinkHref= {iconPath + '#event'}>
                            </use>
                          </svg>
                        </span>
                        <p>
                          <b>Event</b> was performed •&nbsp;
                          {moment(event.createdAt).format('YYYY-MM-DD HH:mm Z')}
                        </p>
                      </div>
                      <div className="slds-chat-event__rule"></div>
                      <div className="slds-chat-event__agent-message">
                        {event.log}
                      </div>
                    </div>
                  </li>
                );
              }
              if ((event.context) && (event.context.type === 'User')) {
                return (
                  <li
                    className="slds-chat-listitem slds-chat-listitem_event"
                    key={event.id}>
                    <div className="slds-chat-event">
                      <div className="slds-chat-event__rule"></div>
                      <div className="slds-chat-event__body">
                        <span className={svgIconClass}>
                          <svg className={iconClass} aria-hidden="true">
                            <use
                              xlinkHref={iconPath + '#user'}>
                            </use>
                          </svg>
                        </span>
                        <p>
                          <b>User</b> has joined room •&nbsp;
                          {moment(event.createdAt).format('YYYY-MM-DD HH:mm Z')}
                        </p>
                      </div>
                      <div className="slds-chat-event__rule"></div>
                    </div>
                  </li>
                );
              }
              return (
                <li className="slds-chat-listitem" key={event.id}>
                  <div className="slds-chat-message">
                    <div className="slds-chat-message__body slds-chat_past">
                      <div className="slds-chat-message__meta">
                        <b>User</b> •&nbsp;
                        {moment(event.createdAt).format('YYYY-MM-DD HH:mm Z')}
                      </div>
                      <div className="slds-chat-message__text">
                        <span>{event.log}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            }
            return (<div key={event.id}></div>);
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
  user: PropTypes.object,
};

module.exports=App;
