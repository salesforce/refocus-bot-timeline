/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const TIMEOUT = 3000; // ms

/**
 * @param {object} props
 * @returns {JSX} toast container.
 */
export default function ToastMessage(props) {
  const { message, clicked, closed } = props;

  useEffect(() => {
    setTimeout(closed, TIMEOUT);
  }, [props.message]);

  return (
    <div className="slds-size_1-of-1 slds-show">
      <div className="slds-region_narrow slds-is-relative">
        <div className="slds-notify_container slds-is-absolute"
          style={{ bottom: '10px', top: 'auto' }}>
          <div onClick={clicked}
            className="slds-notify slds-notify_toast"
            style={{ width: 'auto' }}
            role="alert">
            <div className="slds-notify__content">
              <a className="slds-text-heading_small slds-text-link">
                {message}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ToastMessage.propTypes = {
  message: PropTypes.string.isRequired,
  clicked: PropTypes.func.isRequired,
  closed: PropTypes.func.isRequired,
};
