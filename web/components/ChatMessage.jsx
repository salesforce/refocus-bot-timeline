import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
const moment = require('moment');
const React=require('react');
const linkifyHtml = require('linkifyjs/html');
import './chat.css';

class ChatMessage extends React.Component{
  render(){
    const { event } = this.props;

    return (
      <li className="slds-chat-listitem" key={event.id}>
        <div className="slds-chat-message">
          <div className="slds-chat-message__body slds-chat_past">
            <div className="slds-chat-message__meta">
              <b>{((event.context) && (event.context.user)) ?
                event.context.user.name : 'User'}</b> •&nbsp;
              {moment(event.createdAt).format('YYYY-MM-DD HH:mm Z')}
            </div>
            <div className="slds-chat-message__text">
              {
                <span>
                  {ReactHtmlParser(linkifyHtml(event.log, {
                    attributes: {
                      rel: 'noopener noreferrer'
                    }
                  }))}
                </span>
              }
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
