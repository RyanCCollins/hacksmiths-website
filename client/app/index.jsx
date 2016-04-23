import react from 'react';
import HelpingApp from './components/HelpingApp';

let helpingAppTarget = document.getElementById('react-helping-app');

if (helpingAppTarget) {
  ReactDOM.render(
    <HelpingApp />,
    helpingAppTarget);
}
