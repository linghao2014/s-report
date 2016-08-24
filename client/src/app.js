import React from 'react';
import {render} from 'react-dom';
import {Router, Route , browserHistory, IndexRedirect} from 'react-router';
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
import Report from './route/report';
import Team from './route/team';
import TeamEdit from './route/team/edit';

injectTapEventPlugin();

const App = (props) => {
    return (
        <MuiThemeProvider>
            {props.children}
        </MuiThemeProvider>
    );
};

const App2 = React.createClass({
    render() {
        return (
            <MuiThemeProvider>
                {this.props.children}
            </MuiThemeProvider>
        );
    }
});

const rootRoute = {
    path: '/',
    component: App2,
    childRoutes: [
        Login,
        Register,
        Find,
        Reset
    ]
};

render(<Router history={browserHistory} routes={rootRoute}/>,
    document.getElementById('app-container'));