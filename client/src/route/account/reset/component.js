/**
 * 重置密码
 */
import React from 'react';
import {RaisedButton, AppBar, IconButton, TextField, Paper, Divider} from 'material-ui';
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left';
import {browserHistory} from 'react-router';
import {fetch} from 'lib/util';
import 'sass/login_form.scss';

module.exports = React.createClass({
    getInitialState() {
        return {errors: {}};
    },
    render() {
        return (
            <div>
                <AppBar
                    title="设置密码"
                    iconElementLeft={<IconButton onClick={e => browserHistory.go(-1)}><BackIcon /></IconButton>}/>
                <div className="login-form">
                    <div className="inputs">
                        <TextField
                            name="password"
                            type="password"
                            errorText={this.state.errors.password}
                            onChange={evt=>this.setState({password: evt.target.value})}
                            onBlur={this._checkPass}
                            fullWidth
                            underlineShow={false}
                            hintText="新密码"/>
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
                        onClick={this._reset}
                        className="login"
                        primary
                        fullWidth
                        label={this.state.loading ? '重置中...' : '重置'}/>
                </div>
            </div>
        );
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
    _reset() {
        let ok = this._checkPass();
        ok = this._checkPass() && ok;
        if (!ok) return;
        this.setState({
            err: '',
            loading: true
        });
        fetch('/api/user/reset', {method: 'post', body: {password: this.state.password, key: this.props.params.key}})
            .then(data => {
                alert('密码重置成功');
                browserHistory.replace('/login');
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    err: e.msg
                });
            });
    }
});