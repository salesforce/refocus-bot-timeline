/* eslint-disable max-params */

const jsforce = require('jsforce');

const env = require('./config.js').env;
const config = require('./config.js')[env];
const bdk = require('@salesforce/refocus-bdk')(config);

const { chatterLoginDetails, chatterOptionsArray, httpProxy } = config;
const conn = [];
const START_OF_ARRAY = 0;
const NOT_FOUND = -1;

chatterLoginDetails.map((option, index) => {
  const loginUrl = option.loginurl;
  if (httpProxy) {
    conn.push(new jsforce.Connection({ loginUrl, httpProxy }));
  } else {
    conn.push(new jsforce.Connection({ loginUrl }));
  }
  conn[index].login(option.username, option.password, (loginErr) => {
    if (loginErr) {
      bdk.log.error(loginUrl, loginErr);
    }
  });
});

/**
 * @param {string} caseNumber  - caseNumber from room
 * @param {object} connection - connection to salesforce org
 * @returns {Promise} - promise resolving an object containing the case
 */
function getCaseByCaseNumber(caseNumber, connection) {
  return new Promise((resolve, reject) => {
    const q = `SELECT id FROM Case WHERE CaseNumber = '${caseNumber}'`;
    connection.query(q).execute((err, resp) => {
      if (err) {
        bdk.log.error('ERROR', err, resp);
        reject(err);
      }
      if (resp.records[START_OF_ARRAY]) {
        resolve(resp);
      }
    });
  });
}

/**
 * @param {object} attachmentObject - object with the details of the file
 * @param {object} connection - connection to salesforce org
 * @returns {Promise} - resolves the response from salesforce to the attachment
 */
function createAttachmentOnCase(attachmentObject, connection) {
  return new Promise((resolve, reject) => {
    connection
      .sobject('Attachment')
      .create(attachmentObject, (postErr, ret) => {
        if (postErr) {
          bdk.log.error('ERROR', postErr, ret);
          reject(postErr);
        }
        resolve(ret);
      });
  });
}

/**
 * Creates a new attachment in Salesforce
 *
 * @param {Object} timelineBotAttachment - attachment Details
 * @param {String} userName - Username of person posting file
 * @param {String} caseNumber - Case number used to get case id
 * @param {String} id - Action ID
 * @param {string} selectedChatter - the chatter to send to
 */
async function postAttachment(
  timelineBotAttachment,
  userName,
  caseNumber,
  id,
  selectedChatter
) {
  const chatterIndex = chatterOptionsArray.indexOf(selectedChatter);

  // eslint-disable-next-line
  if (!timelineBotAttachment) return;
  if (chatterIndex === NOT_FOUND) {
    bdk.log.error(
      'Invalid Selected Org Setting in post attachment',
      selectedChatter
    );
  } else {
    try {
      const caseResponse = await getCaseByCaseNumber(
        caseNumber,
        conn[chatterIndex]
      );
      const attachmentObject = {
        ParentId: caseResponse.records[START_OF_ARRAY].Id,
        Name: timelineBotAttachment.name,
        Body: timelineBotAttachment.file,
        ContentType: timelineBotAttachment.type,
      };
      const postResponse = await createAttachmentOnCase(
        attachmentObject,
        conn[chatterIndex]
      );
      const eventLog = {
        log: userName + ' has uploaded' + timelineBotAttachment.name,
        context: {
          type: 'Event',
          attachment:
            chatterLoginDetails[chatterIndex].loginurl +
            '/servlet/servlet.FileDownload?file=' +
            postResponse.id,
          fileType: timelineBotAttachment.type,
          fileName: timelineBotAttachment.name,
          userName,
        },
      };

      postResponse.name = timelineBotAttachment.name;
      postResponse.type = timelineBotAttachment.type;
      postResponse.imageUrl =
        chatterLoginDetails[chatterIndex].loginurl +
        '/servlet/servlet.FileDownload?file=' +
        postResponse.id;
      // needs to be same parameters from package.json
      const parametersOverride = [
        { value: postResponse.imageUrl, name: 'timelineBotAttachment' },
      ];
      bdk.log.info(eventLog);
      bdk.respondBotAction(id, postResponse, eventLog, parametersOverride);
    } catch (err) {
      bdk.log.error(`Failed to attach upload to case #${caseNumber}. ${err}`);
    }
  }
}

module.exports = {
  postAttachment,
};
