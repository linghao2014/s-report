/**
 * 进入引导
 */
import React from 'react';
import RespBox from 'cpn/resp_box';
import 'sass/login_form.scss';

const barConf = {title: '欢迎加入'};

export default React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        return (
            <RespBox barConf={barConf}>
                <h2>hello</h2>
            </RespBox>
        );
    }
});