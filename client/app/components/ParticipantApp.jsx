import react from 'react';
import RSVPStore from '../stores/RSVPStore';

export default class ParticipatingApp extends React.Component {
  constructor(props) {
    super(props);
    this.renderHeading = this.bind(this.renderHeading, this);
  }

  getInitialState() {
    return {
      isReady: RSVPStore.isLoaded(),
      participants: RSVPStore.getParticipants()
    };
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
      participants: RSVPStore.getParticipants()
    });
  }

  renderHeading() {
    if (!this.state.isReady) return <h3 className="heading-with-line">...</h3>
    var count = this.state.participants ? this.state.participants.length : '...';
    var plural = count === 1 ? ' person is' : 'people are';
    return <h3 className="heading-with-line"> { count + plural } </h3>;
  }

  render() {
    let participantList = [];

    if (this.state.isReady) {
      participantList = this.state.participants.map(function(person) {
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
          className="participating">
          { this.renderHeading() }
          <ul
            className="list-unstyled list-inline text-center participants-list"
          ></ul>
        </section>
      </div>
    );
  }
}
