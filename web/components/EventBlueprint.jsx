/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './chat.css';

/**
 * @param {object} props
 * @returns {JSX} event blueprint container.
 */
export default function EventBlueprint(props) {
  let name;
  const { event, color, imgUrl, type, message } = props;

  if (event.context && event.context.user) {
    name = event.context.user.fullName ?
      event.context.user.fullName : event.context.user.name;
  }

  return (
    <li className="slds-is-relative slds-m-bottom-small">
      <span
        className="event-line"
        style={{ background: color }}>
      </span>
      <div className="slds-m-around--small">
        <div className="slds-media">
          <div className="slds-media__figure">
            <div
              className="slds-icon_container slds-timeline__icon"
              style={{ backgroundColor: color }}>
              <svg className="slds-icon slds-icon_small" aria-hidden="true">
                <use
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xlinkHref={imgUrl}>
                </use>
              </svg>
            </div>
          </div>
          <div className="slds-media__body">
            <div className="slds-grid slds-grid_align-spread">
              <div className={'slds-grid slds-grid_vertical-align-center ' +
              'slds-truncate_container_75'}>
                <h3 className="slds-truncate">
                  <a>
                    <strong>{type} - {name}</strong>
                  </a>
                </h3>
              </div>
              <div className={'slds-timeline__actions ' +
              'slds-timeline__actions_inline'}>
                <p className="slds-timeline__date slds-text-align--right">
                  {moment.utc(event.createdAt).format('HH:mm UTC | MM/DD/YYYY')}
                </p>
              </div>
            </div>
            <div className="slds-chat-message__text">
              {message}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

EventBlueprint.propTypes = {
  event: PropTypes.object,
  color: PropTypes.string,
  type: PropTypes.string,
  imgUrl: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
};
