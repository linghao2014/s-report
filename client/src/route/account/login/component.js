/**
 * 登录
 */
import React from 'react';
import {RaisedButton, AppBar, IconButton, TextField, Paper, Divider} from 'material-ui';
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left';
import 'sass/login_form.scss';
import {fetch} from 'lib/util';

module.exports = React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        return (
            <div>
                <AppBar
                    title="登录"
                    iconElementLeft={<IconButton href="#"><BackIcon /></IconButton>}/>
                <div className="login-form">
                    <div className="inputs">
                        <TextField
                            onChange={evt=>this.setState({username: evt.target.value})}
                            name="account"
                            type="mail"
                            fullWidth
                            underlineShow={false}
                            hintText="邮箱"/>
                        <Divider/>
                        <TextField
                            onChange={evt=>this.setState({password: evt.target.value})}
                            name="password"
                            type="password"
                            fullWidth
                            underlineShow={false}
                            hintText="密码"/>
                    </div>
                    <RaisedButton
                        onClick={this._login}
                        className="login"
                        primary
                        fullWidth
                        label="登录"/>
                    <p className="find"><a href="#/find">找回密码</a></p>
                </div>
            </div>
        );
    },
    _getData() {
        return {
            username: this.state.username,
            password: this.state.password
        }
    },
    _login() {
        fetch('/api/user/login', {method: 'post', body: this._getData()})
            .then(resp => {
                return resp.json();
            })
            .then(data => {
                debugger
            })
            .catch(e => {

            });
    }
});