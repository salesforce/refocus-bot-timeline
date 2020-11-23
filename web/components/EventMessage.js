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

const SLDS_PINK = '#eb7092';

/**
 * @param {object} props
 * @param {string} props.event - event that user has joined/left the room.
 * @returns {JSX} event message container.
 */
export default function EventMessage(props) {
  const { event } = props;
  return (
    <EventBlueprint
      event={event}
      type={'Event'}
      imgUrl={'../static/icons/standard-sprite/svg/symbols.svg#event'}
      color={SLDS_PINK}
      message={event.log}
    />
  );
}

EventMessage.propTypes = {
  event: PropTypes.object,
};
