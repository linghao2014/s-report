/**
 * 注册
 */
import React from 'react';
import {RaisedButton, AppBar, IconButton, TextField, Paper, Divider} from 'material-ui';
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left'
import 'sass/login_form.scss';

export default React.createClass({
    render() {
        return (
            <div>
                <AppBar
                    title="注册"
                    iconElementLeft={<IconButton href="#"><BackIcon /></IconButton>}/>
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
                            name="name"
                            type="text"
                            fullWidth
                            underlineShow={false}
                            hintText="昵称"/>
                        <Divider/>
                        <TextField
                            name="password"
                            type="password"
                            fullWidth
                            underlineShow={false}
                            hintText="密码"/>
                        <Divider/>
                        <TextField
                            name="repeatPassword"
                            type="password"
                            fullWidth
                            underlineShow={false}
                            hintText="确认密码"/>
                    </div>
                    <RaisedButton
                        className="login"
                        primary
                        fullWidth
                        label="注册"/>
                </div>
            </div>
        );
    }
});