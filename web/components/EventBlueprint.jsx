/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types';
import './chat.css';

const moment = require('moment');
const React=require('react');

class EventBlueprint extends React.Component{
  render(){
    let name;
    const { event } = this.props;

    if (event.context && event.context.user) {
      name = event.context.user.fullName ?
        event.context.user.fullName : event.context.user.name;
    }

    return (
      <li className="slds-p-around--small">
        <div className="">
          <div className="slds-media">
            <div className="slds-media__figure">
              <div
                className={`slds-icon_container slds-timeline__icon`}
                style = {{ backgroundColor: this.props.color}}>
                <svg className="slds-icon slds-icon_small" aria-hidden="true">
                  <use
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xlinkHref={this.props.imgUrl}>
                  </use>
                </svg>
              </div>
              <div
                className="event-line"
                style={{ background: this.props.color }}>
              </div>
            </div>
            <div className="slds-media__body">
              <div className="slds-grid slds-grid_align-spread slds-timeline__trigger">
                <div className="slds-grid slds-grid_vertical-align-center slds-truncate_container_75">
                  <h3 className="slds-truncate" title="Event">
                    <a href="javascript:void(0);">
                      <strong>{this.props.type} - {name}</strong>
                    </a>
                  </h3>
                </div>
                <div className="slds-timeline__actions slds-timeline__actions_inline">
                  <p className="slds-timeline__date">
                    {moment.utc(event.createdAt).format('HH:mm UTC | MM/DD/YYYY')}
                  </p>
                </div>
              </div>
              <div className="slds-chat-message__text">
              {this.props.message}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

EventBlueprint.propTypes={
  event: PropTypes.object,
};

module.exports = EventBlueprint;
