/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
const moment = require('moment');
const React=require('react');
const linkifyHtml = require('linkifyjs/string');
const decode = require('unescape');
import './chat.css';
const EventHeader = require('./EventHeader.jsx');

class ChatMessage extends React.Component{
  render(){
    const { event } = this.props;
    let name;

    if (event.context && event.context.user) {
      name = event.context.user.fullName ?
        event.context.user.fullName : event.context.user.name;
    }

    return (
      <li style={{borderBottom: '1px solid #dddbda'}}>
        <div className="slds-p-around--medium">
          <div className="slds-media">
            <div className="slds-media__body">  
              <EventHeader type={event} iconUrl={'../static/icons/standard-sprite/svg/symbols.svg#post'} iconType={'post'}/>
              <div className="slds-chat-message__text">
                {
                  <span>
                    {
                      ReactHtmlParser(
                        linkifyHtml(event.log, {
                          attributes: {
                            rel: 'noopener noreferrer'
                          }
                        })
                      ).map((htmlString) => {
                        if (typeof htmlString === 'string') {
                          return decode(htmlString);
                        } else {
                          return htmlString;
                        }
                      })
                    }
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

ChatMessage.propTypes={
  event: PropTypes.object,
};

module.exports=ChatMessage;
