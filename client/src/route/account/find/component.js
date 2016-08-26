/**
 * 找回密码
 */
import React from 'react';
import {RaisedButton, AppBar, IconButton, TextField, Paper, Divider} from 'material-ui';
import {browserHistory} from 'react-router';
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left';
import {isMail, fetch} from 'lib/util';
import 'sass/login_form.scss';

module.exports = React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        return (
            <div>
                <AppBar
                    title="找回密码"
                    iconElementLeft={<IconButton onClick={e => browserHistory.go(-1)}><BackIcon /></IconButton>}/>
                <div className="login-form">
                    <div className="inputs">
                        <TextField
                            onChange={e => this.setState({mail: e.target.value})}
                            onBlur={this._checkMail}
                            name="account"
                            type="mail"
                            fullWidth
                            underlineShow={false}
                            hintText="注册邮箱"/>
                    </div>
                    <p className="err">{this.state.err}&nbsp;</p>
                    <RaisedButton
                        disabled={this.state.loading}
                        onClick={this._find}
                        className="login"
                        primary
                        fullWidth
                        label={this.state.loading ? '找回中...' : '找回'}/>
                </div>
            </div>
        );
    },
    _checkMail() {
        if (!this.state.mail) {
            this.state.err = '请输入邮箱';
        } else if (!isMail(this.state.mail)) {
            this.state.err = '邮箱格式不正确';
        } else {
            this.state.err = null;
        }
        this.setState(this.state);
        return !this.state.err;
    },
    _find() {
        if (!this._checkMail()) return;
        this.setState({
            loading: true,
            err: ''
        });
        fetch('/api/user/find', {
            method: 'post',
            body: {mail: this.state.mail}
        })
            .then(data => {
                this.setState({
                    loading: false
                });
                alert(`密码重置邮件已发送至${this.state.mail},请尽快登录邮箱重置您的密码`);
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    err: e.msg
                });
            });
    }
});