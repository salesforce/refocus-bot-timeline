/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './chat.css';
const { env } = require('../../config');
const { enableDropzone } = require('../../config')[env];

/**
 * @param {object} props
 * @returns {JSX} attachment message container.
 */
export default function ChatBox(props) {
  const { chatChange, sendChat, uploadFile, pendingMessage } = props;

  /**
   * @param {object} value - current props value
   * @returns {object} previous props object.
   */
  function usePreviousProps(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevProps = usePreviousProps(props);
  if (prevProps && prevProps.pendingMessage && props.currentText === '') {
    document.getElementById('chat').innerText = '';
  }

  return (
    <div className={'slds-docked-composer__footer slds-grid slds-form' +
    ' slds-form_stacked slds-p-horizontal_medium'}>
      <div className="slds-form-element slds-col">
        <div className="slds-form-element__control slds-p-around_xx-small">
          <div
            id="chat"
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
            }}
          ></div>
        </div>
      </div>
      <div className="slds-p-around_xx-small">
        <button
          id="send-button"
          disabled={pendingMessage}
          className="slds-button slds-button_brand"
          onClick={() => sendChat()}
        >
          {pendingMessage ? (
            <p className="saving">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </p>
          ) : (
            'Send'
          )}
        </button>
        {enableDropzone ? (
          <label className="slds-button slds-button_brand">
            Attach File
            <input
              id="file-input"
              type="file"
              multiple
              onChange={(e) => uploadFile(e)}
            />
          </label>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

ChatBox.propTypes = {
  currentText: PropTypes.string,
  chatChange: PropTypes.func,
  sendChat: PropTypes.func,
  uploadFile: PropTypes.func,
  pendingMessage: PropTypes.bool,
};
