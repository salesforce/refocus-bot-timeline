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
const EventHeader = require('./EventHeader.jsx');
import './chat.css';

class EventMessage extends React.Component{
  render(){
    const { event } = this.props;
    const svgIconClass = 'slds-icon_container slds-icon-utility-change_owner ' +
      'slds-chat-icon';
    const iconClass = 'slds-icon slds-m-bottom_xx-small slds-icon_xx-small';
    const iconPath = '../static/icons/utility-sprite/svg/symbols.svg';
    let name;

    if (event.context && event.context.user) {
      name = event.context.user.fullName ?
        event.context.user.fullName : event.context.user.name;
    }

    return (
      <li style={{padding: '20px'}}>
        <div className="">
          <div className="slds-media">
            <EventHeader type={"event"}/>
            <div className="slds-media__body">
              <div className="slds-grid slds-grid_align-spread slds-timeline__trigger">
                <div className="slds-grid slds-grid_vertical-align-center slds-truncate_container_75 slds-no-space">
                  <h3 className="slds-truncate" title="Event">
                    <a href="javascript:void(0);">
                      <strong>Event - {name}</strong>
                    </a>
                  </h3>
                </div>
                <div className="slds-timeline__actions slds-timeline__actions_inline">
                  <p className="slds-timeline__date">
                    {moment.utc(event.createdAt).format('HH:mm UTC | MM/DD/YYYY')}
                  </p>
                </div>
              </div>
              <div style={{
                width: '3px',
                height: '40px',
                background: '#eb7092',
                marginTop: '5px',
                marginLeft: '10px'}}>
              </div>
              <p>{event.log}</p>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

EventMessage.propTypes={
  event: PropTypes.object,
};

module.exports=EventMessage;


