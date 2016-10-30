/**
 * 报告
 */
import React from 'react';
import {FlatButton, Card, CardActions, CardHeader, IconButton,
    CardText, List, ListItem, Avatar, Divider, Popover, Menu, MenuItem} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import {fetch} from 'lib/util';
import popup from 'cpn/popup';
import {style} from '../../index.scss';
import pubsub from 'vanilla-pubsub';

module.exports = React.createClass({
    getInitialState() {
        return {rps: [], myTeams: []};
    },
    componentDidMount() {
        let barConf = {
            title: '报告',
            iconElementRight: <IconButton onTouchTap={this._create}><AddIcon/></IconButton>
        };
        pubsub.publish('config.appBar', barConf);
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
        return (
            <div className={style}>
                {
                    this.state.rps.map(x => <Card key={x.id} className="item">
                        <CardHeader
                            className="header"
                            title={x.periodDesc}
                            subtitle={x.toTeam && x.toTeam.teamName ? `已发送:${x.toTeam.teamName}` : '未发送'}/>
                        <CardText>
                            {
                                x.content
                            }
                        </CardText>
                        <CardActions>
                            <FlatButton label="编辑" onClick={this._onEdit.bind(this, x)}/>
                            <FlatButton label="删除" onClick={this._delete.bind(this, x)}/>
                            <FlatButton label="发送"
                                        disabled={x.toTeam && !!x.toTeam.teamName}
                                        onClick={this._onSend.bind(this, x)}/>
                        </CardActions>
                    </Card>)
                }
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
        let reportId = this.state.currentRp.id;
        fetch('/api/report/send', {
            method: 'post',
            body: {
                reportId: this.state.currentRp.id,
                teamId: teamId
            }
        }).then(d => {
                _.find(this.state.rps, {id: reportId}).toTeam = d.toTeam;
                this.forceUpdate();
                popup.success('发送成功');
            })
            .catch(e => {
                popup.error('发送失败');
            });
        this.setState({anchorEl: null, currentRp: null});
    }
});