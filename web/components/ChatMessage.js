/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react';
import linkifyHtml from 'linkifyjs/string';
import decode from 'unescape';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import EventBlueprint from './EventBlueprint';
import { BLUE } from '../utils/colors';
import './chat.css';

/**
 * @param {object} props
 * @returns {JSX} chat message container.
 */
export default function ChatMessage(props) {
  const { event } = props;

  return (
    <EventBlueprint
      event={event}
      imgUrl={'../static/icons/standard-sprite/svg/symbols.svg#post'}
      type={'Comment'}
      color={BLUE}
      message={
        ReactHtmlParser(
          linkifyHtml(event.log, {
            attributes: {
              rel: 'noopener noreferrer'
            }
          })
        ).map((htmlString) => {
          if (typeof htmlString === 'string') {
            return decode(htmlString);
          }

          return htmlString;
        })
      }
    />
  );
}

ChatMessage.propTypes = {
  event: PropTypes.object,
};
