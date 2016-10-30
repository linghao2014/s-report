/**
 * 报告
 */
import React from 'react';
import {FlatButton, Card, CardActions, CardHeader, IconButton,
    CardText, List, ListItem, Avatar, Divider, Popover, Menu, MenuItem} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import {fetch} from 'lib/util';
import popup from 'cpn/popup';
import {style} from '../index.scss';
import Edit from './edit';


const cover = 'http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=200y200';

module.exports = React.createClass({
    getInitialState() {
        return {rps: []};
    },
    componentDidMount() {
        fetch('/api/report/team')
            .then(d => {
                this.setState({
                    rps: d.list,
                    teamMap: d.teamMap,
                    userMap: d.userMap
                });
            });
    },
    render() {
        let barConf = {
            title: '报告',
            iconElementRight: <IconButton onTouchTap={this._create}><AddIcon/></IconButton>
        };
        return (
            <div className={style}>
                {
                    this.state.rps.map(x => <Card key={x.id} className="item">
                        <CardHeader
                            title={this.state.teamMap[x.teamId].name}
                            subtitle={x.periodDesc}/>
                        <div className="team">
                            {
                                x.list.map(y => <div key={y._id} className="inner-item">
                                    <Avatar
                                        className="avatar"
                                        src={cover}/>
                                    <h3>{this.state.userMap[y.userId].nickname}</h3>
                                    <ul>
                                        <li>{y.content}</li>
                                    </ul>
                                </div>)
                            }
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
                    </Card>)
                }
            </div>
        );
    }
});