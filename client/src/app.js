import React from 'react';
import {render} from 'react-dom';
import {Router, Route , browserHistory, IndexRedirect, Link} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {AppBar} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Popup} from 'cpn/popup';
import 'sass/reset.scss';
import 'sass/login_form.scss';

injectTapEventPlugin();

const App = (props) => {
    return <div id="route-root">{props.children}<Popup/></div>;
};

const rootRoute = {
    path: '/',
    component: App,
    childRoutes: [
        require('./route/account/login'),
        require('./route/account/register'),
        require('./route/account/find'),
        require('./route/account/reset'),
        require('./route/index'),
        require('./route/guide'),
        require('./route/report'),
        require('./route/group'),
        require('./route/team'),
        require('./route/team/edit')
    ]
};

render(
    <MuiThemeProvider><Router history={browserHistory} routes={rootRoute}/></MuiThemeProvider>,
    document.getElementById('app-container'),
    function () {
        if(!location.pathname || location.pathname == '/') {
            browserHistory.replace('/index');
        }
    });