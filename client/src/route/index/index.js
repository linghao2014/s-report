/**
 * 首页
 */
import React from 'react';
import {RaisedButton} from 'material-ui';
import {style} from './index.scss';

const labelColor = '#00bcd4';
const btnStyle = {marginRight: '20px'};

export default React.createClass({
    render() {
        return (
            <div className={style}>
                <div className="banner">
                    <h1>简报</h1>
                    <p>简单好用的日报、周报、月报管理系统</p>
                    <p>免费的信息同步工具</p>
                    <div className="btn">
                        <RaisedButton label="登录" labelColor={labelColor} style={btnStyle}/>
                        <RaisedButton label="注册" labelColor={labelColor}/>
                    </div>
                </div>
            </div>
        );
    }
});