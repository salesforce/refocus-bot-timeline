import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
const React=require('react');
const ToastMessage=require('./ToastMessage.jsx');
const botName = require('../../package.json').name;
const bdk = require('../../lib/refocus-bdk.js');

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
    this.setState({response: eventLog});
  }

  closeToast(){
    this.setState({message: ''});
  }

  render(){
    const { response } = this.state;

    return(
      <div>
        <div class="slds-form-element">
          <label class="slds-form-element__label" for="text-input-id-1">Chat</label>
          <div class="slds-form-element__control">
            <input id="chat" type="text" id="text-input-id-1" class="slds-input" placeholder="Type Message" />
            <button class="slds-button" onClick={() => this.sendChat()}>Send</button>
          </div>
        </div>
        <table className="slds-table slds-table_bordered slds-table_cell-buffer">
          <tbody>
            {response.map((event) => {
              return(
                <tr>
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
}

module.exports=App;