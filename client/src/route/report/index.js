/**
 * 报告
 */
import React from 'react';
import {FlatButton, Card, CardActions, CardHeader, IconButton, CardText, List, ListItem, Avatar} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import RespBox from 'cpn/resp_box';
import {style} from './index.scss';

const barConf = {title: '报告', iconElementRight: <IconButton><AddIcon/></IconButton>};

export default React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        return (
            <RespBox className={style} barConf={barConf}>
                <Card className="item">
                    <CardHeader
                        title="张三"
                        avatar="http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=200y200"
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
                    <CardText>
                        <List>
                            <ListItem
                                leftAvatar={<Avatar src="http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=200y200"/>}
                                primaryText="李伟"
                                secondaryText={<p>1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节<br/>1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节2</p>}
                                secondaryTextLines="3"/>
                            <ListItem
                                leftAvatar={<Avatar src="http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=200y200"/>}
                                primaryText="李伟"
                                secondaryText={<p>1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节<br/>1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节1123412341341234来得及啊圣诞节2</p>}
                                secondaryTextLines="3"/>
                        </List>
                    </CardText>
                    <CardActions>
                        <FlatButton label="邮件发送"/>
                    </CardActions>
                </Card>
            </RespBox>
        );
    }
});