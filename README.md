# Timeline-Bot

### Environment Variables
Note: If you want to test this locally you will need some environment variables:
* ```API_TOKEN``` - Used for Requests to Refocus. Created in refoucs/tokens/new.
* ```SOCKET_TOKEN``` (Returned Upon Installation) - Used for Socket Connection.
* ```NODE_ENV (defaults to 'dev')``` - Used to determine which instance of Refocus to install the bot.
* ```REFOCUS_URL``` (OPTIONAL) - Used to specify which refocus instance to point to.

## Release History
Follows [semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning#semver-for-publishers)
* 1.0.0 Basic timeline functionality works.
* 1.0.1 Urls in the middle of message appear as links.
* 1.0.2 Message remains in text box until it is sent successfully.
* 1.0.3 Added support for attachments from dropzone
* 1.0.4 Added support for room activate/deactivate
* 1.0.5 Removed public folder and reference to refocus-connect.
* 1.1.0 Fix message focus after message sent, Fix UI issues, UTC Times only
* 1.1.1 Uses fullName instead of email for events/messages etc.
* 1.1.2 Fix less than sign issues
* 1.1.3 Fix scroll on tag change, Add multiple tag support, Default to Comments and Attachments
* 1.1.4 Get All Events
* 1.1.5 Make images clickable
* 1.1.6 Remove extra scripts
* 1.1.7 Add env variable for refocus url
* 1.1.8 Stop auto scroll and make toast on new Event.
* 1.1.9 Allow copy and paste with newlines and can type a newline with SHIFT + ENTER
* 1.1.10 Uglify for production.
* 1.1.11 Added display name.
* 1.1.12 Only loading fields as they are toggled.
* 1.1.13 Rebrand to look more like activity-timeline.
* 1.1.14 Change staging to perf env.
* 1.1.15 Don't show Slack Events in Timeline.
* 1.1.16 Clean up config.js
