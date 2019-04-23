/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types';

const React = require('react');
import './chat.css';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatChange: this.props.chatChange,
      sendChat: this.props.sendChat,
      pendingMessage: this.props.pendingMessage,
    };
  }

  /* eslint-disable react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    this.setState({
      pendingMessage: nextProps.pendingMessage
    });

    if (nextProps.currentText === '') {
      document.getElementById('chat').innerText = '';
    }
  }

  render() {
    const { chatChange, sendChat, pendingMessage } = this.state;
    const footerClass = 'slds-docked-composer__footer slds-grid slds-form' +
      ' slds-form_stacked slds-p-horizontal_medium';

    return (
      <div className={footerClass}>
        <div className="slds-form-element slds-col">
          <div className="slds-form-element__control slds-p-around_xx-small">
            <div id="chat"
              cy-data="chat-box"
              className="slds-input slds-rich-text-editor"
              contentEditable="true"
              onKeyUp={chatChange}
              placeholder="Type Message"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  if (!event.shiftKey && !pendingMessage) {
                    event.preventDefault();
                    sendChat();
                  }
                }
              }}>
            </div>
          </div>
        </div>
        <div className="slds-p-around_xx-small">
          <button
            cy-data="send"
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

ChatBox.propTypes = {
  currentText: PropTypes.string,
  chatChange: PropTypes.func,
  sendChat: PropTypes.func,
  pendingMessage: PropTypes.bool
};

module.exports = ChatBox;
