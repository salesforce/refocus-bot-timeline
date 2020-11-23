/**
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import FilterHeader from './FilterHeader';
import EventMessage from './EventMessage';
import UserMessage from './UserMessage';
import ChatMessage from './ChatMessage';
import AttachmentMessage from './AttachmentMessage';
import ToastMessage from './ToastMessage';
import ChatBox from './ChatBox';
import postAttachment from '../services/postAttachment';
import './chat.css';

const { env } = require('../../config.js');
const config = require('../../config.js')[env];
const botName = require('../../package.json').name;
const bdk = require('@salesforce/refocus-bdk')(config, botName);
const ZERO = 0;
const DFB = 5; // Distance From Bottom
const MAX_FILE_SIZE = 5000000;

function App(props) {
  const [toast, setToast] = useState(false);
  const response = props.response;
  const [events, setEvents] = useState(response);
  const [currentText, setCurrentText] = useState('');
  const [scroll, setScroll] = useState(true);
  const [fileDraggedOver, setFileDraggedOver] = useState(false);
  const [filter, setFilter] = useState('CommentAttachment');
  const [pendingMessage, setPendingMessage] = useState(false);

  useEffect(() => {
    const chatList = document.getElementById('chat-list');
    const previousEvents = events;
    const latestEvent = response[ZERO];

    if (scroll && chatList) {
      chatList.scrollTop = chatList.scrollHeight;
      setScroll(false);
    }

    if (latestEvent && !_.find(previousEvents, latestEvent)) {
      const allEvents = previousEvents.concat(response)
        .filter((value, index, self) => {
          const duplicates = _.filter(self.slice(ZERO, index), ['id', value.id ]);
          return duplicates.length === ZERO ? value : false;
        }).sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));
      setEvents(allEvents);

      if (chatList && chatList.scrollHeight - chatList.scrollTop - DFB <= chatList.clientHeight) {
        setScroll(true);
      } else {
        setToast(latestEvent && latestEvent.context &&
          (filter === 'All' || filter.includes(latestEvent.context.type)));
      }
    }
  });

  function filterType(type) {
    props.getEventsByType(type);
    if (filter === 'All' || type === 'All') {
      setFilter(type);
    } else if (filter.includes(type)) {
      if (filter === type) {
        setFilter('All');
      } else {
        setFilter(filter.replace(type, ''));
      }
    } else {
      setFilter(filter + type);
    }

    setScroll(true);
  }


  function sendChat() {
    if (currentText === '') {
      return;
    }
    
    const eventType = {
      type: 'Comment',
      user: props.user,
      join: true,
    };

    setPendingMessage(true);

    bdk.createEvents(props.roomId, currentText, eventType)
      .then(() => {
        setCurrentText('');
        setPendingMessage(false);
      });
  }

  /**
   * @param {object} e - event object from file dropped on component
   * @param {string} botName
   */
  function doUpload(e, botName) {
    setFileDraggedOver(false);
    const data = e.dataTransfer ? e.dataTransfer : e.target;
    const { files } = data;
    if (files[0].size < MAX_FILE_SIZE) {
      postAttachment(files[0], botName, this.props.selectedChatter);
    } else {
      console.error('File is too large to upload')
    }
    e.stopPropagation();
    e.preventDefault();
  }

  /**
   * @param {object} e - event object on file dragged over component
   */
  function fileIsDraggedOver(e) {
    const { fileDraggedOver } = this.state;
    if (!fileDraggedOver) {
      setFileDraggedOver(true);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  /**
   * @param {object} e - event object generated on file dragged away from zone
   */
  function fileDraggedAway(e) {
    setFileDraggedOver(false);
    e.preventDefault();
  }


  return (
    <div>
      <FilterHeader filter={filter} changeType={filterType} />
      <div
        id="file-drop"
        onDragOver={fileIsDraggedOver}
        className={ fileDraggedOver ? 'file-dragged-over' : 'no-file-dragged-over' }
        onDragLeave={fileDraggedAway}
        onDrop={(e) => doUpload(e, botName)}
      >
        <ul
          className="slds-chat-list slds-m-bottom--xx-small"
          id="chat-list"
        >
          <li>
            <div className="slds-chat-bookend">
              Start of timeline for&nbsp;<b>Room #{props.roomId}</b>
            </div>
          </li>
          {events.map((event) => {
            const isAttachment =
              filter.includes('Attachment') &&
              event.context.type === 'Event' &&
              event.context.attachment;
            const isSelectedFilter =
              event.context && filter.includes(event.context.type);

            if (
              filter === 'All' ||
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
      {toast ? (
        <ToastMessage
          message={'Jump to new Event..'}
          closed={() => setToast(false)}
          clicked={() => {
            setScroll(true);
            setToast(false);
          }}
        />
      ) : (
        <div></div>
      )}
      <ChatBox
        currentText={currentText}
        chatChange={(e) => setCurrentText(e.target.innerText)}
        sendChat={sendChat}
        pendingMessage={pendingMessage}
        uploadFile={(e) => doUpload(e, botName)}
      />
    </div>
  );
}

App.propTypes = {
  roomId: PropTypes.number,
  response: PropTypes.array,
  user: PropTypes.object,
  selectedChatter: PropTypes.string,
  getEventsByType: PropTypes.func,
};

export default App;
