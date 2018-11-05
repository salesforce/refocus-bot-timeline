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

const sldsGrey = '#54698d';

class UserMessage extends React.Component{
  render() {
    const { event } = this.props;
    const name = event.context.user.fullName ?
      event.context.user.fullName : event.context.user.name;
    const message = `${((event.context) && (event.context.user)) ?
      name : 'User'} has  ${((event.context) && (event.context.isActive)) ?
      'joined' : 'left'} room.`;

    return (
      <EventBlueprint
        event={event}
        type={`User ${event.context &&
          event.context.isActive ? 'Joined' : 'Left'}`}
        imgUrl={'../static/icons/standard-sprite/svg/symbols.svg#user'}
        color={sldsGrey}
        message = {message}
      />
    );
  }
}

UserMessage.propTypes={
  event: PropTypes.object,
};

module.exports = UserMessage;
