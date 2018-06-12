import PropTypes from 'prop-types';
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

    if (nextProps.currentText === '') {
      document.getElementById('chat').innerText = '';
    }
  }

  render(){
    const { currentText, chatChange, sendChat, pendingMessage } = this.state;
    const footerClass = 'slds-docked-composer__footer slds-grid slds-form' +
      ' slds-form_stacked slds-p-horizontal_medium';

    return (
      <div className={footerClass}>
        <div className="slds-form-element slds-col">
          <div className="slds-form-element__control slds-p-around_xx-small">
            <div id="chat"
              onKeyUp={chatChange}
              placeholder="Type Message"
              onKeyPress={(event) => {
                if ((event.key === 'Enter' && !event.shiftKey) &&
                  (!pendingMessage)) {
                  sendChat();
                }
              }}
              contentEditable="true" className="slds-input slds-rich-text-editor" style={{ maxHeight: '100px', overflow: 'auto' }}>
            </div>
          </div>
        </div>
        <div className="slds-p-around_xx-small">
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
