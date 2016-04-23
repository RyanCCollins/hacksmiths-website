import _ from 'lodash';
import Store from 'store-prototype';
import request from 'superagent';

const RSVPStore = new Store();

let loaded = false;
let event = {};
let rsvp = {};
let helpers = [];

// 5 second refresh interval
const REFRESH_INTERVAL = 5000;
let refreshTimeout = null;

function cancelRefresh() {
  clearTimeout(refreshTimeout);
}

RSVPStore.extend({

  getEvent() {
      return event;
    },

    getRSVP() {
      return rsvp;
    },

    getHelpers(callback) {
      return helpers;
    },

    rsvp(attending, callback) {
      cancelRefresh();
      request
        .post('/api/me/event')
        .send({
          data: {
            event: hacksmiths.currentEventId,
            attending
          }
        })
        .end((err, res) => {
          if (err) {
            console.log('Error with the AJAX request: ', err)
            return;
          }
          RSVPStore.getEventData();
        });
    },

    isLoaded() {
      return loaded ? true : false;
    },

    getEventData(callback) {
      // ensure any scheduled refresh is stopped,
      // in case this was called directly
      cancelRefresh();
      // request the update from the API
      request
        .get('/api/event/${hacksmiths.currentEventId}')
        .end((err, res) => {
          if (err) {
            console.log('Error with the AJAX request: ', err)
          }
          if (!err && res.body) {
            loaded = true;
            event = res.body.event;
            rsvp = res.body.rsvp;
            helpers = res.body.attending;
            RSVPStore.notifyChange();
          }
          RSVPStore.queueEventRefresh();
          return callback && callback(err, res.body);
        });
    },

    queueEventRefresh() {
      refreshTimeout = setTimeout(RSVPStore.getEventData, REFRESH_INTERVAL);
    }

});

RSVPStore.getEventData();
export default RSVPStore;
