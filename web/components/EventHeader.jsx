/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types';
const moment = require('moment');
const React = require('react');
import './chat.css';

class EventHeader extends React.Component{
  render() {
    return (
      <div className="slds-media__figure">
        <div className={`slds-icon_container slds-icon-standard-${this.props.type} slds-timeline__icon`}>
          <svg className="slds-icon slds-icon_small" aria-hidden="true">
            <use
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xlinkHref={`../static/icons/standard-sprite/svg/symbols.svg#${this.props.type}`}>
            </use>
          </svg>
        </div>
      </div>
    );
  }
}

module.exports = EventHeader;
