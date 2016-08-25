/**
 * 群组
 */
import React from 'react';
import {FlatButton, IconButton, ListItem, Avatar, Subheader} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SetIcon from 'material-ui/svg-icons/action/settings';
import RespBox from 'cpn/resp_box';
import {style} from './index.scss';

module.exports =  React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        let barConf = {
            title: '群组',
            iconElementRight: <IconButton onTouchTap={this._create}><AddIcon/></IconButton>
        };
        return (
            <RespBox className={style} barConf={barConf}>
                <Subheader>我管理的群组</Subheader>
                <ul className="teams">
                    <li>
                        <h3>超级前端组</h3>
                        <div className="count">
                            <span>成员:4</span>
                            <span>关注:4</span>
                        </div>
                        <div className="ops">
                            <IconButton>
                                <DeleteIcon color="#666"/>
                            </IconButton>
                            <IconButton>
                                <SetIcon color="#666"/>
                            </IconButton>
                        </div>
                    </li>
                </ul>
                <Subheader>我加入的群组</Subheader>
                <ul className="teams">
                    <li>
                        <h3>超级前端组</h3>
                        <div className="count">
                            <span>成员:4</span>
                            <span>关注:4</span>
                        </div>
                    </li>
                    <li>
                        <h3>超级前端组</h3>
                        <div className="count">
                            <span>成员:4</span>
                            <span>关注:4</span>
                        </div>
                    </li>
                    <li>
                        <h3>超级前端组</h3>
                        <div className="count">
                            <span>成员:4</span>
                            <span>关注:4</span>
                        </div>
                    </li>
                </ul>
                <Subheader>我关注的群组</Subheader>
                <ul className="teams">
                    <li>
                        <h3>超级前端组</h3>
                        <div className="count">
                            <span>成员:4</span>
                            <span>关注:4</span>
                        </div>
                        <FlatButton
                            secondary
                            className="follow"
                            label="取消关注"/>
                    </li>
                </ul>
                <Subheader>未关注的群组</Subheader>
                <ul className="teams">
                    <li>
                        <h3>超级前端组</h3>
                        <div className="count">
                            <span>成员:4</span>
                            <span>关注:4</span>
                        </div>
                        <FlatButton
                            primary
                            className="follow"
                            label="关注"/>
                    </li>
                </ul>
            </RespBox>
        );
    }
});