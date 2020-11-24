/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react';
import PropTypes from 'prop-types';
import './chat.css';

/**
 * @param {object} props
 * @returns {JSX} filter header container.
 */
export default function FilterHeader(props) {
  const { filter, changeType } = props;

  return (
    <div className={'slds-size_1-of-1 slds-text-align_center' +
    ' slds-docked-composer__header'}>
      <ul>
        <li className="slds-show--inline">
          <button
            className={'slds-button slds-m-around--xxx-small ' +
            (filter === 'All' ? 'slds-button_brand' : 'slds-button_neutral')}
            onClick={() => changeType('All')}>
            All
          </button>
        </li>
        <li className="slds-show--inline">
          <button
            className={'slds-button slds-m-around--xxx-small ' +
            (filter.includes('Comment') ?
              'slds-button_brand' :
              'slds-button_neutral')}
            onClick={() => changeType('Comment')}>
            <svg className="slds-button__icon slds-button__icon_left"
              aria-hidden="true">
              <use
                xlinkHref
                  ="../static/icons/standard-sprite/svg/symbols.svg#post">
              </use>
            </svg>
            Comments
          </button>
        </li>
        <li className="slds-show--inline">
          <button
            className={'slds-button slds-m-around--xxx-small ' +
            (filter.includes('Event') ?
              'slds-button_brand' :
              'slds-button_neutral')}
            onClick={() => changeType('Event')}>
            <svg className="slds-button__icon slds-button__icon_left"
              aria-hidden="true">
              <use
                xlinkHref="../static/icons/standard-sprite/svg/symbols.svg#event">
              </use>
            </svg>
            Events
          </button>
        </li>
        <li className="slds-show--inline">
          <button
            className={'slds-button slds-m-around--xxx-small ' +
            (filter.includes('User') ?
              'slds-button_brand' :
              'slds-button_neutral')}
            onClick={() => changeType('User')}>
            <svg className="slds-button__icon slds-button__icon_left"
              aria-hidden="true">
              <use
                xlinkHref="../static/icons/standard-sprite/svg/symbols.svg#user"></use>
            </svg>
            Users
          </button>
        </li>
        <li className="slds-show--inline">
          <button
            className={'slds-button slds-m-around--xxx-small ' +
            (filter.includes('Attachment') ?
              'slds-button_brand' :
              'slds-button_neutral')}
            onClick={() => changeType('Attachment')}>
            <svg className="slds-button__icon slds-button__icon_left"
              aria-hidden="true">
              <use
                xlinkHref="../static/icons/standard-sprite/svg/symbols.svg#file"></use>
            </svg>
            Attachments
          </button>
        </li>
      </ul>
    </div>
  );
}

FilterHeader.propTypes = {
  filter: PropTypes.string,
  changeType: PropTypes.func,
};
