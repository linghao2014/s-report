/**
 * 登录
 */
import React from 'react';
import {RaisedButton, AppBar, IconButton, TextField, Paper, Divider} from 'material-ui';
import {browserHistory, Link} from 'react-router';
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left';
import md5 from 'blueimp-md5';
import {isMail} from 'lib/util';
import 'sass/login_form.scss';
import {fetch} from 'lib/util';

module.exports = React.createClass({
    getInitialState() {
        return {errors: {}};
    },
    render() {
        return (
            <div>
                <AppBar
                    title="登录"
                    iconElementLeft={<IconButton onClick={e => browserHistory.go(-1)}><BackIcon /></IconButton>}/>
                <div className="login-form">
                    <div className="inputs">
                        <TextField
                            onChange={evt=>this.setState({username: evt.target.value})}
                            onBlur={this._checkMail}
                            errorText={this.state.errors.username}
                            name="username"
                            type="mail"
                            fullWidth
                            underlineShow={false}
                            hintText="邮箱"/>
                        <Divider/>
                        <TextField
                            onKeyDown={e => e.which == 13 && this._login()}
                            onChange={evt=>this.setState({password: evt.target.value})}
                            onBlur={this._checkPass}
                            errorText={this.state.errors.password}
                            name="password"
                            type="password"
                            fullWidth
                            underlineShow={false}
                            hintText="密码"/>
                    </div>
                    <p className="err">{this.state.err}&nbsp;</p>
                    <RaisedButton
                        disabled={this.state.loading}
                        onClick={this._login}
                        className="login"
                        primary
                        fullWidth
                        label={this.state.loading ? '登录中...' : '登录'}/>
                    <p className="find"><Link to="/find">找回密码</Link></p>
                </div>
            </div>
        );
    },
    _checkMail() {
        if (!this.state.username) {
            this.state.errors.username = '请输入邮箱';
        } else if (!isMail(this.state.username)) {
            this.state.errors.username = '邮箱格式不正确';
        } else {
            this.state.errors.username = null;
        }
        this.setState(this.state);
        return !this.state.errors.username;
    },
    _checkPass() {
        if (!this.state.password) {
            this.state.errors.password = '请输入密码';
        } else {
            this.state.errors.password = null;
        }
        this.setState(this.state);
        return !this.state.errors.password;
    },
    _getData() {
        return {
            username: this.state.username,
            password: md5(this.state.password)
        }
    },
    _login() {
        let ok = this._checkMail();
        ok = this._checkPass() && ok;
        if(!ok) return;
        this.setState({
            err: '',
            loading: true
        });
        fetch('/api/user/login', {method: 'post', body: this._getData()})
            .then(data => {
                let next = this.props.location.state && this.props.location.state.nextPathname;
                window._user = data.user;
                browserHistory.replace(next ? next : '/index');
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    err: e.msg
                });
            });
    }
});