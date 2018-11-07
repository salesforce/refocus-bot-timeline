/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import './chat.css';

const React=require('react');
const linkifyHtml = require('linkifyjs/string');
const decode = require('unescape');
const EventBlueprint = require('./EventBlueprint.jsx');
const sldsBlue = '#34becd';

class ChatMessage extends React.Component{
  render(){
    const { event } = this.props;

    return (
      <EventBlueprint
        event={event}
        imgUrl={'../static/icons/standard-sprite/svg/symbols.svg#post'}
        type={'Comment'}
        color={sldsBlue}
        message = {
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
}

ChatMessage.propTypes={
  event: PropTypes.object,
};

module.exports = ChatMessage;
