/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types';
import FilterHeader from './FilterHeader';
import EventMessage from './EventMessage';
import UserMessage from './UserMessage';
import ChatMessage from './ChatMessage';
import AttachmentMessage from './AttachmentMessage';
import ToastMessage from './ToastMessage';
import ChatBox from './ChatBox';
import {
  fileIsDraggedOver,
  fileDraggedAway,
  doUpload,
} from './dropzoneActions';
import './chat.css';

const moment = require('moment');
const _ = require('lodash');
const React = require('react');
const { env } = require('../../config.js');
const config = require('../../config.js')[env];
const botName = require('../../package.json').name;
const bdk = require('@salesforce/refocus-bdk')(config, botName);
const ZERO = 0;
const DFB = 5; // Distance From Bottom

const fileDraggedOverStyle = {
  borderBottom: '2px solid #005fb2',
  borderLeft: '2px solid #005fb2',
  borderRight: '2px solid #005fb2',
};

const noFileDraggedOverStyle = {
  borderBottom: '2px solid #00000000',
  borderLeft: '2px solid #00000000',
  borderRight: '2px solid #00000000',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toast: false,
      response: this.props.response.sort((a, b) =>
        moment(a.createdAt)
          .diff(moment(b.createdAt))
          .filter((value, index, self) => {
            const duplicates = _.filter(self.slice(ZERO, index), [
              'id',
              value.id,
            ]);
            return duplicates.length === ZERO ? value : false;
          })
      ),
      currentText: '',
      scroll: false,
      filter: 'CommentAttachment',
      pendingMessage: false,
    };
    this.closeToast = this.closeToast.bind(this);
    this.filterType = this.filterType.bind(this);
    this.chatChange = this.chatChange.bind(this);
    this.sendChat = this.sendChat.bind(this);
    this.clicked = this.clicked.bind(this);
    this.fileIsDraggedOver = fileIsDraggedOver.bind(this);
    this.fileDraggedAway = fileDraggedAway.bind(this);
    this.doUpload = doUpload.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    this.setState({ scroll: true });
  }

  componentDidUpdate(prevProps) {
    if (this.state.scroll && this.container) {
      this.container.scrollTop = this.container.scrollHeight;
      this.setState({ scroll: false });
    }

    if (_.isEqual(this.props.response, prevProps.response)) return;
    const previousEvents = this.state.response || [];
    const latestEvent = this.props.response[ZERO];

    if (latestEvent && !_.find(previousEvents, latestEvent)) {
      const newState = {};
      const allEvents = previousEvents
        .concat(this.props.response)
        .filter((value, index, self) => {
          const duplicates = _.filter(self.slice(ZERO, index), [
            'id',
            value.id,
          ]);
          return duplicates.length === ZERO ? value : false;
        })
        .sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));
      newState.response = allEvents;
      const chatList = document.getElementById('chat-list');

      if (
        chatList &&
        chatList.scrollHeight - chatList.scrollTop - DFB <=
          chatList.clientHeight
      ) {
        newState.scroll = true;
      } else {
        newState.toast =
          latestEvent &&
          latestEvent.context &&
          (this.state.filter === 'All' ||
            this.state.filter.includes(latestEvent.context.type));
      }

      this.setState(newState);
    }
  }

  uploadFile(e) {
    this.doUpload(e, bdk, botName);
  }

  closeToast() {
    this.setState({ toast: false });
  }

  clicked() {
    this.setState({
      scroll: true,
      toast: false,
    });
  }

  filterType(type) {
    this.props.getEventsByType(type);
    if (this.state.filter === 'All' || type === 'All') {
      this.setState({ filter: type });
    } else if (this.state.filter.includes(type)) {
      if (this.state.filter === type) {
        this.setState({ filter: 'All' });
      } else {
        this.setState({
          filter: this.state.filter.replace(type, ''),
        });
      }
    } else {
      this.setState({
        filter: this.state.filter + type,
      });
    }

    this.setState({ scroll: true });
  }

  chatChange(e) {
    this.setState({ currentText: e.target.innerText });
  }

  sendChat() {
    if (this.state.currentText !== '') {
      const eventType = {
        type: 'Comment',
        user: this.props.user,
        join: true,
      };

      this.setState({ pendingMessage: true });
      bdk
        .createEvents(this.props.roomId, this.state.currentText, eventType)
        .then(() => {
          this.setState({
            pendingMessage: false,
            currentText: '',
          });
        });
    }
  }

  render() {
    const { response, fileDraggedOver } = this.state;

    return (
      <div>
        <FilterHeader filter={this.state.filter} changeType={this.filterType} />
        <div
          id="file_drop"
          onDragOver={this.fileIsDraggedOver}
          style={
            fileDraggedOver ? fileDraggedOverStyle : noFileDraggedOverStyle
          }
          onDragLeave={this.fileDraggedAway}
          onDrop={this.uploadFile}
        >
          <ul
            className="slds-chat-list slds-m-bottom--xx-small"
            id="chat-list"
            ref={(elem) => {
              this.container = elem;
            }}
          >
            <li>
              <div className="slds-chat-bookend">
                Start of timeline for&nbsp;<b>Room #{this.props.roomId}</b>
              </div>
            </li>
            {response.map((event) => {
              const isAttachment =
                this.state.filter.includes('Attachment') &&
                event.context.type === 'Event' &&
                event.context.attachment;
              const isSelectedFilter =
                event.context && this.state.filter.includes(event.context.type);

              if (
                this.state.filter === 'All' ||
                isSelectedFilter ||
                isAttachment
              ) {
                if (
                  event.context &&
                  (event.context.type === 'Event' ||
                    event.context.type === 'RoomState') &&
                  !event.context.attachment
                ) {
                  return <EventMessage event={event} key={event.id} />;
                }
                if (event.context && event.context.type === 'User') {
                  return <UserMessage event={event} key={event.id} />;
                }
                if (
                  event.context &&
                  event.context.type === 'Event' &&
                  event.context.attachment
                ) {
                  return <AttachmentMessage event={event} key={event.id} />;
                }
                return <ChatMessage event={event} key={event.id} />;
              }
              return <div key={event.id}></div>;
            })}
          </ul>
        </div>
        {this.state.toast ? (
          <ToastMessage
            message={'Jump to new Event..'}
            closed={this.closeToast}
            clicked={this.clicked}
          />
        ) : (
          <div></div>
        )}
        <ChatBox
          currentText={this.state.currentText}
          chatChange={this.chatChange}
          sendChat={this.sendChat}
          pendingMessage={this.state.pendingMessage}
          uploadFile={this.uploadFile}
        />
      </div>
    );
  }
}

App.propTypes = {
  roomId: PropTypes.number,
  response: PropTypes.array,
  user: PropTypes.object,
  selectedChatter: PropTypes.string,
  getEventsByType: PropTypes.func,
};

export default App;
