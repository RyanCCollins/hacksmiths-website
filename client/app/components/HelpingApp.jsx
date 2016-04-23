import react from 'react';
import RSVPStore from '../stores/RSVPStore';

export default class HelpingApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  getInitialState() {
    return (
      isReady: RSVPStore.isLoaded(),
      helpers: RSVPStore.getHelpers()
    )
  }

  componentDidMount() {
    RSVPStore.addChangeListener(this.updateStateFromStore);
  }

  componentWillUnmount() {
    RSVPStore.removeChangeListener(this.updateStateFromStore);
  }

  updateStateFromStore() {
    this.setState({
      isReady: RSVPStore.isLoaded(),
      helpers: RSVPStore.getHelpers()
    });
  }

  renderHeading() {
    if (!this.state.isReady) return <h3 className="heading-with-line">...</h3>
    var count = this.state.helpers ? this.state.helpers.length : '...';
    var plural = count === 1 ? ' person is' : 'people are';
    return <h3 className="heading-with-line"> { count + plural } </h3>;
  }

  render() {
    const helpingList;

    if (this.state.isReady) {
      helperList = this.state.helpers.map(function(person) {
        return (
          <li key={ person.id }>
            <a href={ person.url }>
              <img
                width="40"
                height="40"
                alt={ person.name }
                className="img-circle"
                src={ person.photo ? person.photo : "/images/avatar.png" }
              />
            </a>
          </li>
        );
      });
    }
    return (
      <div>
        <section
          className="helping"
          { this.renderHeading() }
          <ul
            className="list-unstyled list-inline text-center attendees-list"
          ></ul>
        ></section>
      </div>
    );
  }
}
