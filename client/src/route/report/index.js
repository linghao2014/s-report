/**
 * 报告
 */
import React from 'react';
import {FlatButton, Card, CardActions, CardHeader, IconButton, CardText, List, ListItem, Avatar, Divider} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import RespBox from 'cpn/resp_box';
import {style} from './index.scss';
import Edit from './edit';


const cover = 'http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=200y200';

export default React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        let barConf = {
            title: '报告',
            iconElementRight: <IconButton onTouchTap={this._create}><AddIcon/></IconButton>
        };
        return (
            <RespBox className={style} barConf={barConf}>
                <Card className="item">
                    <CardHeader
                        className="header"
                        title="张三"
                        avatar={cover}
                        subtitle="2016-06-02 日报"/>
                    <CardText>
                        <p>1.干了什么事情,哈哈哈</p>
                        <p>2.打酱油悠悠的</p>
                        <p>3.改bug</p>
                    </CardText>
                    <CardActions>
                        <FlatButton label="编辑"/>
                        <FlatButton label="删除"/>
                        <FlatButton label="发送"/>
                    </CardActions>
                </Card>
                <Card className="item">
                    <CardHeader
                        title="前端组"
                        subtitle="2016-06-02 日报"/>
                    <div className="team">
                        <div className="inner-item">
                            <Avatar
                                className="avatar"
                                src={cover}/>
                            <h3>李伟</h3>
                            <ul>
                                <li>1. abc</li>
                                <li>2. def</li>
                            </ul>
                        </div>
                        <div className="inner-item">
                            <Avatar
                                className="avatar"
                                src={cover}/>
                            <h3>李伟</h3>
                            <ul>
                                <li>1. abc</li>
                                <li>2. def</li>
                            </ul>
                        </div>
                    </div>
                    <CardActions>
                        <FlatButton label="邮件发送"/>
                        <div className="not">
                            <label>暂未发送:</label>
                            <Avatar
                                size={30}
                                src={cover}/>
                            <Avatar
                                size={30}
                                src={cover}/>
                        </div>
                    </CardActions>
                </Card>
                <Edit ref="edit"/>
            </RespBox>
        );
    },
    _create() {
        this.refs.edit.toggle(true);
    }
});