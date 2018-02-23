import PropTypes from 'prop-types';
const moment = require('moment');
const React=require('react');
import './chat.css';

class ChatBox extends React.Component{
  constructor(props){
    super(props);
    this.state={
      currentText: this.props.currentText,
      chatChange: this.props.chatChange,
      sendChat: this.props.sendChat,
      pendingMessage: this.props.pendingMessage,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentText: nextProps.currentText,
      pendingMessage: nextProps.pendingMessage
    });
  }

  render(){
    const { currentText, chatChange, sendChat, pendingMessage } = this.state;
    const footerClass = 'slds-docked-composer__footer slds-grid slds-form' +
      ' slds-form_stacked slds-p-horizontal_medium slds-m-bottom_small';

    return (
      <div className={footerClass}>
        <div className="slds-size_1-of-1 slds-form-element slds-col">
          <div className="slds-form-element__control slds-p-around_xx-small">
            <input
              id="chat"
              type="search"
              className="slds-input"
              placeholder="Type Message"
              value={currentText}
              onChange={chatChange}
              disabled={pendingMessage}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  sendChat();
                }
              }}/>
          </div>
        </div>
        <div className="slds-col slds-p-around_xx-small">
          <button
            disabled={pendingMessage}
            className="slds-button slds-button_brand"
            onClick={() => sendChat()}>
            {pendingMessage ?
              <p className="saving">
                <span>.</span><span>.</span><span>.</span>
              </p> : 'Send'}
          </button>
        </div>
      </div>
    );
  }
}

ChatBox.propTypes={
  currentText: PropTypes.string,
  chatChange: PropTypes.func,
  sendChat: PropTypes.func,
  pendingMessage: PropTypes.bool
};

module.exports=ChatBox;
