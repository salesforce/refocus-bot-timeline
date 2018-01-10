import PropTypes from 'prop-types';
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
      response: this.props.response,
      currentText: '',
    };
    this.closeToast = this.closeToast.bind(this);
    this.sendChat = this.sendChat.bind(this);
    this.chatChange = this.chatChange.bind(this);
  }

  sendChat(){
    this.setState({ currentText: '' });
    bdk.createEvents(this.state.roomId, this.state.currentText);
  }

  componentWillReceiveProps(nextProps) {
    const eventLog = this.state.response.concat(nextProps.response);
    this.setState({ response: eventLog });
    this.container.scrollTop = this.container.scrollHeight;
  }

  closeToast(){
    this.setState({ message: '' });
  }

  chatChange(e){
    this.setState({ currentText: e.target.value });
  }

  render(){
    const { response } = this.state;
    return (
      <div>
        <ul className="slds-chat-list"
          ref={(elem) => this.container = elem}>
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
        <div className="slds-docked-composer__footer slds-grid slds-form slds-form_stacked slds-p-horizontal_medium slds-m-bottom_small">
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
          <div className="slds-text-align_center slds-col  slds-p-around_xx-small">
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
