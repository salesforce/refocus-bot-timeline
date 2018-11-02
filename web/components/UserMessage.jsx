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

const MasterComponent = require('./MasterComponent.jsx');

class UserMessage extends React.Component{
  render(){
    const { event } = this.props;
    const svgIconClass = 'slds-icon_container slds-icon-utility-change_owner ' +
      'slds-chat-icon';
    const iconClass = 'slds-icon slds-m-bottom_xx-small slds-icon_xx-small';
    const iconPath = '../static/icons/utility-sprite/svg/symbols.svg';
    const name = event.context.user.fullName ?
      event.context.user.fullName : event.context.user.name;

    const message = `${((event.context) && (event.context.user)) ?
                  name : 'User'} has  ${((event.context) && (event.context.isActive)) ?
                'joined' : 'left'} room.`

    return (


      <MasterComponent
        event={event}
        type={`User ${event.context && event.context.isActive ? 'Joined' : 'Left'}`}
        imgUrl={"../static/icons/standard-sprite/svg/symbols.svg#user"}
        color={"#54698d"}
        message = {message}
      />

    );
  }
}

UserMessage.propTypes={
  event: PropTypes.object,
};

module.exports=UserMessage;
