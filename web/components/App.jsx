/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import FilterHeader from './FilterHeader.jsx';
import EventMessage from './EventMessage.jsx';
import UserMessage from './UserMessage.jsx';
import ChatMessage from './ChatMessage.jsx';
import AttachmentMessage from './AttachmentMessage.jsx';
import ToastMessage from './ToastMessage.jsx';
import ChatBox from './ChatBox.jsx';
import './chat.css';

const { env } = require('../../config.js');
const config = require('../../config.js')[env];
const botName = require('../../package.json').name;
const bdk = require('@salesforce/refocus-bdk')(config, botName);
import MessageService from '../services/MessageService';
import AttachmentService from '../services/AttachmentService';

const ZERO = 0;
const DFB = 5; // Distance From Bottom
const messageService = new MessageService(bdk);
const attachmentService = new AttachmentService(bdk);

/**
 * @param {object} props
 * @returns {JSX} app container.
 */
export default function App(props) {
  let container;
  const { response } = props;
  const [toast, setToast] = useState(false);
  const [events, setEvents] = useState(response);
  const [currentText, setCurrentText] = useState('');
  const [scroll, setScroll] = useState(true);
  const [fileDraggedOver, setFileDraggedOver] = useState(false);
  const [filter, setFilter] = useState('CommentAttachment');
  const [pendingMessage, setPendingMessage] = useState(false);

  /**
   * @param {array} previousEvents
   * @param {array} newEvents
   */
  function handleNewEventsReceived(previousEvents, newEvents) {
    const allEvents = previousEvents.concat(newEvents).filter((value, index, self) => {
      const duplicates = _.filter(self.slice(ZERO, index), ['id', value.id]);
      return duplicates.length === ZERO ? value : false;
    }).sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));

    setEvents(allEvents);

    if (container && container.scrollHeight - container.scrollTop - DFB <= container.clientHeight) {
      setScroll(true);
    } else {
      const latestEvent = newEvents.length && newEvents[ZERO];
      setToast(latestEvent && latestEvent.context &&
        (filter === 'All' || filter.includes(latestEvent.context.type)));
    }
  }

  useEffect(() => {
    const previousEvents = events;
    const latestEvent = response.length && response[ZERO];

    if (scroll && container) {
      container.scrollTop = container.scrollHeight;
      setScroll(false);
    }

    if (latestEvent && !_.find(previousEvents, latestEvent)) {
      handleNewEventsReceived(previousEvents, response);
    }
  });

  /**
   * changes the active message filter
   * @param {object} type - filter type that was selected
   */
  function changeFilterType(type) {
    if (filter === 'All' || type === 'All') {
      setFilter(type);
    } else if (filter === type) {
      setFilter('All');
    } else if (filter.includes(type)) {
      setFilter(filter.replace(type, ''));
    } else {
      setFilter(filter + type);
    }

    props.getEventsByType(type);
    setScroll(true);
  }

  /**
   * sends a chat message.
   */
  async function sendChat() {
    if (currentText === '') return;
    setPendingMessage(true);

    try {
      await messageService.sendMessage(currentText, props.user);
      setCurrentText('');
      setPendingMessage(false);
    } catch (err){
      console.error(`message failed to send - ${err.message}`);
    }
  }

  /**
   * @param {object} e - event object from file dropped on component
   */
  async function uploadAttachment(e) {
    setFileDraggedOver(false);
    e.stopPropagation();
    e.preventDefault();

    try {
      const data = e.dataTransfer ? e.dataTransfer : e.target;
      const { files } = data;
      await attachmentService.postAttachment(files[0], props.selectedChatter);
    } catch (err){
      console.error(`failed to upload file - ${err.message}`);
    }
  }

  /**
   * @param {object} e - event object on file dragged over component
   */
  function fileDraggedOverHandler(e) {
    setFileDraggedOver(true);
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <div>
      <FilterHeader filter={filter} changeType={changeFilterType} />
      <div
        id="file-drop"
        onDragOver={fileDraggedOverHandler}
        className={ fileDraggedOver ? 'file-dragged-over' : 'no-file-dragged-over' }
        onDragLeave={() => setFileDraggedOver(false)}
        onDrop={uploadAttachment}
      >
        <ul
          className="slds-chat-list slds-m-bottom--xx-small"
          id="chat-list"
          ref={(elem) => {
            container = elem;
          }}
        >
          <li>
            <div className="slds-chat-bookend">
              Start of timeline for&nbsp;<b>Room #{props.roomId}</b>
            </div>
          </li>
          {events.map((event) => {
            const eventType = event.context && event.context.type;
            const isAttachment = filter.includes('Attachment') &&
              eventType === 'Event' && event.context.attachment;
            const isSelectedFilter = event.context && filter.includes(event.context.type);
            if (filter === 'All' || isSelectedFilter || isAttachment) {
              if ((eventType === 'Event' || eventType === 'RoomState') &&
              !event.context.attachment) {
                return <EventMessage event={event} key={event.id} />;
              } else if (eventType === 'User') {
                return <UserMessage event={event} key={event.id} />;
              } else if (eventType === 'Event' && event.context.attachment) {
                return <AttachmentMessage event={event} key={event.id} />;
              }
              return <ChatMessage event={event} key={event.id} />;
            }
            return <div key={event.id}></div>;
          })}
        </ul>
      </div>
      {toast && (
        <ToastMessage
          message={'Jump to new Event..'}
          closed={() => setToast(false)}
          clicked={() => {
            setScroll(true);
            setToast(false);
          }}
        />
      )}
      <ChatBox
        currentText={currentText}
        chatChange={(e) => setCurrentText(e.target.innerText)}
        sendChat={sendChat}
        pendingMessage={pendingMessage}
        uploadFile={uploadAttachment}
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
