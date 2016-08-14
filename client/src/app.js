import React from 'react';
import {render} from 'react-dom';
import {Router, Route , hashHistory, IndexRedirect} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {AppBar} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'sass/reset.scss';
import Index from './route/index';
import Login from './route/account/login';
import Register from './route/account/register';
import Find from './route/account/find';
import Reset from './route/account/reset';
import Guide from './route/guide';

injectTapEventPlugin();

const App = (props) => {
    return (
        <MuiThemeProvider>
            {props.children}
        </MuiThemeProvider>
    );
};

render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRedirect to="index"/>
            <Route path="index" component={Index}/>
            <Route path="login" component={Login}/>
            <Route path="register" component={Register}/>
            <Route path="find" component={Find}/>
            <Route path="reset" component={Reset}/>
            <Route path="guide" component={Guide}/>
        </Route>
    </Router>,
    document.getElementById('app-container'));