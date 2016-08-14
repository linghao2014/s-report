/**
 * 找回密码
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
                    title="找回密码"
                    iconElementLeft={<IconButton><BackIcon /></IconButton>}/>
                <div className="login-form">
                    <div className="inputs">
                        <TextField
                            name="account"
                            type="mail"
                            fullWidth
                            underlineShow={false}
                            hintText="注册邮箱"/>
                    </div>
                    <RaisedButton
                        className="login"
                        primary
                        fullWidth
                        label="找回"/>
                </div>
            </div>
        );
    }
});