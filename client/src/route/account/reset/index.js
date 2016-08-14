/**
 * 重置密码
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
                    title="设置密码"
                    iconElementLeft={<IconButton><BackIcon /></IconButton>}/>
                <div className="login-form">
                    <div className="inputs">
                        <TextField
                            name="password"
                            type="password"
                            fullWidth
                            underlineShow={false}
                            hintText="新密码"/>
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
                        label="确定"/>
                </div>
            </div>
        );
    }
});