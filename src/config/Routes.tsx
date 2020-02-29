import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import TestPage from '../pages/TestPage';

export default class Routes extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/test' component={TestPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}
