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
 * Creates a new attachment in Salesforce
 *
 * @param {Object} timelineBotAttachment - attachment Details
 * @param {String} userName - Username of person posting file
 * @param {String} caseNumber - Case number used to get case id
 * @param {String} id - Action ID
 * @param {string} selectedChatter - the chatter to send to
 */
function postAttachment(
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
    const q = `SELECT id FROM Case WHERE CaseNumber = '${caseNumber}'`;
    conn[chatterIndex].query(q).execute((err, resp) => {
      if (err) {
        bdk.log.error('ERROR', err, resp);
        return;
      }
      if (resp.records[START_OF_ARRAY]) {
        conn[chatterIndex].sobject('Attachment').create(
          {
            ParentId: resp.records[START_OF_ARRAY].Id,
            Name: timelineBotAttachment.name,
            Body: timelineBotAttachment.file,
            ContentType: timelineBotAttachment.type,
          },
          (postErr, ret) => {
            if (postErr) {
              bdk.log.error('ERROR', postErr, ret);
              return;
            }
            const eventLog = {
              log: userName + ' has uploaded' + timelineBotAttachment.name,
              context: {
                type: 'Event',
                attachment:
                  chatterLoginDetails[chatterIndex].loginurl +
                  '/servlet/servlet.FileDownload?file=' +
                  ret.id,
                fileType: timelineBotAttachment.type,
                fileName: timelineBotAttachment.name,
                userName,
              },
            };
            ret.name = timelineBotAttachment.name;
            ret.type = timelineBotAttachment.type;
            ret.imageUrl =
              chatterLoginDetails[chatterIndex].loginurl +
              '/servlet/servlet.FileDownload?file=' +
              ret.id;
            // needs to be same parameters from package.json
            const parametersOverride = [
              { value: ret.imageUrl, name: 'timelineBotAttachment' },
            ];
            bdk.log.info(eventLog);
            bdk.respondBotAction(id, ret, eventLog, parametersOverride);
          }
        );
      }
    });
  }
}

module.exports = {
  postAttachment,
};
