const React=require('react');
import PropTypes from 'prop-types';
const TIMEOUT = 3000; // ms

class ToastMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
      show: false,
    };
    this.closeToast=this.closeToast.bind(this);
  }

  closeToast() {
    this.setState({ show: false });
    if (this.props.closed) {
      this.props.closed();
    }
  }

  componentDidMount() {
    this.setState({ message: this.props.message });
    this.setState({ show: true });
    this.interval = setInterval(() => this.closeToast(), TIMEOUT);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ message: nextProps.message });
    this.setState({ show: true });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { message, show } = this.state;
    const buttonClasses = 'slds-button slds-button_icon ' +
      'slds-notify__close slds-button_icon-inverse';
    let toastContainer = 'slds-size_2-of-2 ';
    toastContainer += show ? 'slds-show' : 'slds-hide';

    return (
      <div className={toastContainer}>
        <div className="slds-region_narrow slds-is-relative">
          <div className="slds-notify_container slds-is-absolute">
            <div onClick = { this.props.clicked }
              className="slds-notify slds-notify_toast"
              style={{width: 'auto'}}
              role="alert">
              <div className="slds-notify__content">
                <a className="slds-text-heading_small slds-text-link">{ message }</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ToastMessage.propTypes = {
  message: PropTypes.string,
  closed: PropTypes.func,
};

module.exports = ToastMessage;
