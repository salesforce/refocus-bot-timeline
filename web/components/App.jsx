import PropTypes from 'prop-types';
import 'react-select/dist/react-select.css';
const React=require('react');
const env = process.env.NODE_ENV || 'dev';
const config = require('../../config.js')[env];
const bdk = require('@salesforce/refocus-bdk')(config);

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      roomId: this.props.roomId,
      response: this.props.response,
    };
    this.closeToast = this.closeToast.bind(this);
    this.sendChat = this.sendChat.bind(this);
  }

  sendChat(){
    bdk.createEvents(this.state.roomId, 'Chat Msg');
  }

  componentWillReceiveProps(nextProps) {
    const eventLog = this.state.response.concat(nextProps.response);
    this.setState({ response: eventLog });
  }

  closeToast(){
    this.setState({ message: '' });
  }

  render(){
    const { response } = this.state;

    return (
      <div>
        <div className="slds-form-element">
          <label className="slds-form-element__label">Chat</label>
          <div className="slds-form-element__control">
            <input
              id="chat"
              type="text"
              className="slds-input"
              placeholder="Type Message" />
            <button
              className="slds-button"
              onClick={() => this.sendChat()}>
              Send
            </button>
          </div>
        </div>
        <table
          className="slds-table slds-table_bordered slds-table_cell-buffer">
          <tbody>
            {response.map((event) => {
              return (
                <tr key>
                  <td>{event.log}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

App.propTypes={
  roomId: PropTypes.number,
  response: PropTypes.object,
};

module.exports=App;