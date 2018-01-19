import PropTypes from 'prop-types';
const moment = require('moment');
const React=require('react');
import './chat.css';

class ChatMessage extends React.Component{
  render(){
    const { event } = this.props;
    const svgIconClass = 'slds-icon_container slds-icon-utility-change_owner ' +
      'slds-chat-icon';

    return (
      <li className="slds-chat-listitem">
        <div className="slds-chat-message">
          <div className="slds-chat-message__body slds-chat_past">
            <div className="slds-chat-message__meta">
              <b>User</b> •&nbsp;
              {moment(event.createdAt).format('YYYY-MM-DD HH:mm Z')}
            </div>
            <div className="slds-chat-message__text">
              <span>{event.log}</span>
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
