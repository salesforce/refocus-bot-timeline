/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react';
import PropTypes from 'prop-types';
import EventBlueprint from './EventBlueprint';
import './chat.css';

const SLDS_GREEN = '#8bcf6a';

/**
 * @param {object} props
 * @param {object} props.event - attachment message event.
 * @returns {JSX} attachment message container.
 */
export default function AttachmentMessage(props) {
  const { event } = props;

  return (
    <EventBlueprint
      event={event}
      type={'File Uploaded'}
      imgUrl={'../static/icons/standard-sprite/svg/symbols.svg#file'}
      color={SLDS_GREEN}
      message={
        <div>
          <div className='slds-chat-event__agent-message'>
            <a href={event.context.attachment} target='_blank'
              rel='noopener noreferrer'>{event.context.fileName}</a>
          </div>
          {event.context.fileType.includes('image') &&
          <div className='slds-chat-event__agent-message'>
            <a href={event.context.attachment} target='_blank'
              rel='noopener noreferrer'>
              <img src={event.context.attachment} className='preview'/>
            </a>
          </div>
          }
        </div>
      }
    />
  );
}

AttachmentMessage.propTypes = {
  event: PropTypes.object,
};
