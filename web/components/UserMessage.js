/**
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react';
import PropTypes from 'prop-types';
import EventBlueprint from './EventBlueprint';
import './chat.css';

const SLDS_GREY = '#54698d';

/**
 * @param {object} props
 * @param {string} props.event - event that user has joined/left the room.
 * @returns {JSX} user message container.
 */
export default function UserMessage(props) {
  const { event } = props;
  const name = event.context.user.fullName ? event.context.user.fullName : event.context.user.name;
  const message = `${((event.context) && (event.context.user)) ?
    name : 'User'} has  ${((event.context) && (event.context.isActive)) ?
    'joined' : 'left'} room.`;

  return (
    <EventBlueprint
      event={event}
      type={`User ${event.context && event.context.isActive ? 'Joined' : 'Left'}`}
      imgUrl={'../static/icons/standard-sprite/svg/symbols.svg#user'}
      color={SLDS_GREY}
      message={message}
    />
  );
}

UserMessage.propTypes = {
  event: PropTypes.object,
};
