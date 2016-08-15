/**
 * 进入引导
 */
import React from 'react';
import RespBox from 'cpn/resp_box';
import {style} from './index.scss';

const barConf = {title: '欢迎加入'};

export default React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        return (
            <RespBox className={style} barConf={barConf}>
                <h2>注册成功</h2>
                <p>请联系管理员加入组织或<a href="#">创建一个新组织</a></p>
            </RespBox>
        );
    }
});