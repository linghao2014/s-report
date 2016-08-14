/**
 * 登录
 */
import React from 'react';
import {RaisedButton, AppBar, IconButton, TextField, Paper, Divider} from 'material-ui';
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left';
import 'sass/login_form.scss';

export default React.createClass({
    render() {
        return (
            <div>
                <AppBar
                    title="登录"
                    iconElementLeft={<IconButton><BackIcon /></IconButton>}/>
                <div className="login-form">
                    <div className="inputs">
                        <TextField
                            name="account"
                            type="mail"
                            fullWidth
                            underlineShow={false}
                            hintText="邮箱"/>
                        <Divider/>
                        <TextField
                            name="password"
                            type="password"
                            fullWidth
                            underlineShow={false}
                            hintText="密码"/>
                    </div>
                    <RaisedButton
                        className="login"
                        primary
                        fullWidth
                        label="登录"/>
                    <p className="find"><a href="#">找回密码</a></p>
                </div>
            </div>
        );
    }
});