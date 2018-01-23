import PropTypes from 'prop-types';
const React=require('react');
import './chat.css';

class FilterHeader extends React.Component{
  constructor(props){
    super(props);
    this.state={
      filter: this.props.filter,
      changeType: this.props.changeType,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ filter: nextProps.filter });
  }

  render(){
    const { filter, changeType } = this.state;
    const buttonHeaderClass = 'slds-size_1-of-1 slds-text-align_center' +
      ' slds-docked-composer__header';

    return (
      <div className={buttonHeaderClass}>
        <ul className="slds-button-group-list-center">
          <li>
            <button
              className={'slds-button ' +
                (filter === 'All' ?
                  'slds-button_brand' :
                  'slds-button_neutral')}
              onClick={() => changeType('All')}>
              All
            </button>
          </li>
          <li>
            <button
              className={'slds-button ' +
                (filter === 'Comment' ?
                  'slds-button_brand' :
                  'slds-button_neutral')}
              onClick={() => changeType('Comment')}>
              Comments
            </button>
          </li>
          <li>
            <button
              className={'slds-button ' +
                (filter === 'Event' ?
                  'slds-button_brand' :
                  'slds-button_neutral')}
              onClick={() => changeType('Event')}>
              Events
            </button>
          </li>
          <li>
            <button
              className={'slds-button ' +
                (filter === 'User' ?
                  'slds-button_brand' :
                  'slds-button_neutral')}
              onClick={() => changeType('User')}>
              Users
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

FilterHeader.propTypes={
  filter: PropTypes.string,
  changeType: PropTypes.func,
};

module.exports=FilterHeader;
