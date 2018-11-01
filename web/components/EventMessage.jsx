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

    console.log(event)



    return (
      <li style={{borderBottom: '1px solid #dddbda'}}>
        <div className="slds-p-around--medium">
          <div className="slds-media">
            <div className="slds-media__body">  
              <EventHeader event={event} iconUrl={'../static/icons/standard-sprite/svg/symbols.svg#event'}/>
              <p className="slds-m-horizontal_xx-small">{event.log}</p>
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
