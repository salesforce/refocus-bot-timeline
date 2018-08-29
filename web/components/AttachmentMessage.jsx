/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types';
const moment = require('moment');
const React=require('react');
import './chat.css';

class AttachmentMessage extends React.Component{
  render(){
    const { event } = this.props;
    const svgIconClass = 'slds-icon_container slds-icon-utility-change_owner ' +
      'slds-chat-icon';
    const iconClass = 'slds-icon slds-m-bottom_xx-small slds-icon_xx-small';
    const iconPath = '../static/icons/utility-sprite/svg/symbols.svg';

    return (
      <li className='slds-chat-listitem slds-chat-listitem_event'>
        <div className='slds-chat-event'>
          <div className='slds-chat-event__rule'></div>
          <div className='slds-chat-event__body'>
            <span className={svgIconClass}>
              <svg className={iconClass} aria-hidden='true'>
                <use
                  xlinkHref= {iconPath + '#event'}>
                </use>
              </svg>
            </span>
            <p>
              <b>File</b> was uploaded •&nbsp;
              {moment.utc(event.createdAt).format('YYYY-MM-DD HH:mm')} UTC
            </p>
          </div>
          <div className='slds-chat-event__rule'></div>
          <div className='slds-chat-event__agent-message'>
            {event.context.userName} uploaded &nbsp;
            <a href={event.context.attachment} target='_blank'
              rel='noopener noreferrer'>{event.context.fileName}</a>
          </div>
          {event.context.fileType.includes('image') &&
            <div className='slds-chat-event__agent-message'>
              <a href={event.context.attachment} target='_blank'
                rel='noopener noreferrer'>
                <img src={event.context.attachment} className='preview' />
              </a>
            </div>
          }
        </div>
      </li>
    );
  }
}

AttachmentMessage.propTypes={
  event: PropTypes.object,
};

module.exports=AttachmentMessage;
