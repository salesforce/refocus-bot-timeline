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

const MasterComponent = require('./MasterComponent.jsx');

class EventMessage extends React.Component{
  render(){
    const { event } = this.props;

    return (
      <MasterComponent
        event={event}
        type={'Event'}
        imgUrl={"../static/icons/standard-sprite/svg/symbols.svg#event"}
        color={"#eb7092"}
        message = {event.log}
      />
    );
  }
}

EventMessage.propTypes={
  event: PropTypes.object,
};

module.exports=EventMessage;


