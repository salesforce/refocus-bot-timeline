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

class EventHeader extends React.Component{
  render() {
    const { event } = this.props;
    let name;

    if (event.context && event.context.user) {
      name = event.context.user.fullName ?
        event.context.user.fullName : event.context.user.name;
    }

    return (
      <div>    
        <div className="slds-timeline__actions slds-timeline__actions_inline">
          <p className="slds-timeline__date">
            {moment.utc(event.createdAt).format('HH:mm UTC | MM/DD/YYYY')}
          </p>
        </div>
        <div>
          <div className="slds-media__figure slds-show--inline">
            <div className="slds-icon_container slds-icon-standard-event slds-timeline__icon">
              <svg className="slds-icon slds-icon_small">
                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={this.props.iconUrl} />
              </svg>
            </div>
          </div>
          <h3 className="slds-truncate slds-show--inline">
            <a>
              <strong>{name}</strong>
            </a>
          </h3>
        </div>
      </div>
    );
  }
}

EventHeader.propTypes={
  event: PropTypes.object,
};

module.exports = EventHeader;
