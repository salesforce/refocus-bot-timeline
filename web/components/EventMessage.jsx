/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types';
import './chat.css';

const React = require('react');
const EventBlueprint = require('./EventBlueprint.jsx');
const sldsPink = '#eb7092';

class EventMessage extends React.Component{
  render() {
    const { event } = this.props;

    return (
      <EventBlueprint
        event= {event}
        type= {'Event'}
        imgUrl = {'../static/icons/standard-sprite/svg/symbols.svg#event'}
        color = {sldsPink}
        message = {event.log}
      />
    );
  }
}

EventMessage.propTypes={
  event: PropTypes.object,
};

module.exports = EventMessage;
