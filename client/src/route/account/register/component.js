/**
 * 注册
 */
import React from 'react';
import {RaisedButton, AppBar, IconButton, TextField, Paper, Divider} from 'material-ui';
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left';
import {browserHistory} from 'react-router';
import 'sass/login_form.scss';
import {isMail, fetch} from 'lib/util';

module.exports = React.createClass({
    getInitialState() {
        return {errors: {}};
    },
    render() {
        return (
            <div>
                <AppBar
                    title="注册"
                    iconElementLeft={<IconButton onClick={e => browserHistory.go(-1)}><BackIcon /></IconButton>}/>
                <div className="login-form">
                    <div className="inputs">
                        <TextField
                            name="username"
                            type="mail"
                            errorText={this.state.errors.username}
                            onChange={evt=>this.setState({username: evt.target.value})}
                            onBlur={this._checkMail}
                            fullWidth
                            underlineShow={false}
                            hintText="邮箱"/>
                        <Divider/>
                        <TextField
                            name="name"
                            type="text"
                            errorText={this.state.errors.nickname}
                            onChange={evt=>this.setState({nickname: evt.target.value})}
                            onBlur={this._checkNick}
                            fullWidth
                            underlineShow={false}
                            hintText="昵称"/>
                        <Divider/>
                        <TextField
                            name="password"
                            type="password"
                            errorText={this.state.errors.password}
                            onChange={evt=>this.setState({password: evt.target.value})}
                            onBlur={this._checkPass}
                            fullWidth
                            underlineShow={false}
                            hintText="密码"/>
                        <Divider/>
                        <TextField
                            name="repeatPassword"
                            type="password"
                            errorText={this.state.errors.password2}
                            onBlur={this._checkPass2}
                            onChange={evt=>this.setState({password2: evt.target.value})}
                            fullWidth
                            underlineShow={false}
                            hintText="确认密码"/>
                    </div>
                    <RaisedButton
                        disabled={this.state.loading}
                        onClick={this._register}
                        className="login"
                        primary
                        fullWidth
                        label={this.state.loading ? '注册中...' : '注册'}/>
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
    _checkNick() {
        if (!this.state.nickname) {
            this.state.errors.nickname = '请输入昵称';
        } else {
            this.state.errors.nickname = null;
        }
        this.setState(this.state);
        return !this.state.errors.nickname;
    },
    _checkPass() {
        if (!this.state.password) {
            this.state.errors.password = '请输入密码';
        } else if (this.state.password.length < 6) {
            this.state.errors.password = '密码长度不能少于6位';
        } else {
            this.state.errors.password = null;
        }
        this.setState(this.state);
        return !this.state.errors.password;
    },
    _checkPass2() {
        if (!this.state.password2) {
            this.state.errors.password2 = '请再次确认密码';
        } else if (this.state.password !== this.state.password2) {
            this.state.errors.password2 = '密码输入不一致';
        } else {
            this.state.errors.password2 = null;
        }
        this.setState(this.state);
        return !this.state.errors.password2;
    },
    _register() {
        if (this._checkMail()
            && this._checkNick()
            && this._checkPass()
            && this._checkPass2()) {
            this.setState({loading: true});
            fetch('/api/user/register', {
                method: 'post',
                body: {
                    username: this.state.username,
                    nickname: this.state.nickname,
                    password: this.state.password
                }
            })
                .then(data=> {
                    this.setState({loading: false});
                })
                .catch(e=> {
                    this.setState({loading: false});
                });
        }
    }
});