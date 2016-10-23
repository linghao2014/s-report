/**
 * 报告
 */
import React from 'react';
import {FlatButton, Card, CardActions, CardHeader, IconButton,
    CardText, List, ListItem, Avatar, Divider, Popover, Menu, MenuItem} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import RespBox from 'cpn/resp_box';
import {fetch} from 'lib/util';
import popup from 'cpn/popup';
import {style} from '../index.scss';
import Edit from './edit';


const cover = 'http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=200y200';

module.exports = React.createClass({
    getInitialState() {
        return {rps: [], myTeams: []};
    },
    componentDidMount() {
        fetch('/api/report/my')
            .then(d => {
                this.setState({
                    rps: d.list
                });
            });
        fetch('/api/team/myList')
            .then(d => {
                this.setState({
                    myTeams: d.teams
                });
            })
    },
    render() {
        let barConf = {
            title: '报告',
            iconElementRight: <IconButton onTouchTap={this._create}><AddIcon/></IconButton>
        };
        return (
            <div className={style} barConf={barConf}>
                {
                    this.state.rps.map(x => <Card key={x.id} className="item">
                        <CardHeader
                            className="header"
                            title="张三"
                            avatar={cover}
                            subtitle={this._renderSubTitle(x)}/>
                        <CardText>
                            {
                                x.content.map((c, i) => <p key={i}>{i + 1}.{c.text}</p>)
                            }
                        </CardText>
                        <CardActions>
                            <FlatButton label="编辑" onClick={this._onEdit.bind(this, x)}/>
                            <FlatButton label="删除" onClick={this._delete.bind(this, x)}/>
                            <FlatButton label="发送"
                                        onClick={this._onSend.bind(this, x)}/>
                        </CardActions>
                    </Card>)
                }
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
                <Edit ref="edit" onOk={this._onAddOrUpdate}/>
                <Popover
                    open={!!this.state.currentRp}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={e => this.setState({currentRp: null})}>
                    <Menu onChange={this._sendToTeam}>
                        {
                            this.state.myTeams.map(t => <MenuItem key={t.id} value={t.id} primaryText={t.name}/>)
                        }
                    </Menu>
                </Popover>
            </div>
        );
    },
    _renderSubTitle(rp) {
        let time = rp.periodTime;
        if (rp.type == 'day') {
            return `${time.year}年${time.month}月${time.date}日 日报`;
        } else if (rp.type == 'week') {
            return `${time.year}年${time.month}月第${time.week}周 周报`;
        } else {
            return `${time.year}年${time.month}月 月报`;
        }
    },
    _create() {
        this.refs.edit.toggle(true);
    },
    _onAddOrUpdate(rp) {
        if (rp.id) {
            fetch('/api/report/update', {
                method: 'post',
                body: {
                    report: rp
                }
            })
                .then(d => {
                    let oldRp = _.find(this.state.rps, {id: rp.id});
                    oldRp.content = rp.content;
                    oldRp.type = rp.type;
                    oldRp.periodTime = rp.periodTime;
                    this.forceUpdate();
                    popup.success('保存成功');
                })
                .catch(e => {
                    popup.success(e.msg || '保存失败');
                });
        } else {
            fetch('/api/report/create', {
                method: 'post',
                body: {
                    report: rp
                }
            })
                .then(d => {
                    this.state.rps.unshift(d.report);
                    this.forceUpdate();
                    popup.success('创建成功');
                })
                .catch(e => {
                    popup.success(e.msg || '创建失败');
                });
        }
    },
    _delete(rp) {
        popup.confirm({
            msg: '确定删除报告?',
            onOk: () => {
                fetch('/api/report/delete?id=' + rp.id)
                    .then(d => {
                        _.remove(this.state.rps, {id: rp.id});
                        this.forceUpdate();
                        popup.success('删除成功');
                    })
                    .catch(e => {
                        popup.success('删除失败');
                    })
            }
        });
    },
    _onSend(rp, e) {
        e.preventDefault();
        this.setState({anchorEl: e.currentTarget, currentRp: rp});
    },
    _onEdit(rp) {
        this.refs.edit.edit(rp);
    },
    _sendToTeam(e, teamId) {
        fetch('/api/report/send', {
            method: 'post',
            body: {
                reportId: this.state.currentRp.id,
                teamId: teamId
            }
        }).then(d => {
                popup.success('发送成功');
            })
            .catch(e => {
                popup.error('发送失败');
            });
        this.setState({anchorEl: null, currentRp: null});
    }
});