/**
 * 进入引导
 */
import React from 'react';
import RespBox from 'cpn/resp_box';
import {style} from './index.scss';
import CreateGroup from './createGroup';

const barConf = {title: '欢迎加入'};

module.exports =  React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        return (
            <RespBox className={style} barConf={barConf}>
                <h2>你还未找到组织哦~</h2>
                <p>请联系管理员加入组织或<a onClick={this._create}>创建一个新组织</a></p>
                <CreateGroup ref="dialog"/>
            </RespBox>
        );
    },
    _create() {
        this.refs.dialog.toggle(true);
    }
});