/**
 * 群组
 */
import React from 'react';
import {browserHistory} from 'react-router';
import {FlatButton, IconButton, ListItem, Avatar, Subheader, Dialog,
    TextField, Toggle} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SetIcon from 'material-ui/svg-icons/action/settings';
import _ from 'lodash';
import {fetch} from 'lib/util';
import popup from 'cpn/popup';
import RespBox from 'cpn/resp_box';
import {style} from './index.scss';

const Teams = function (props) {
    return (
        <ul className="teams">
            {
                props.list.map(t => <li key={t.id}>
                    <h3>{t.name}</h3>
                    <div className="count">
                        <span>成员:{t.memberSize}</span>
                        <span>关注:{t.followSize}</span>
                    </div>
                    {
                        t.admin &&
                        <div className="ops">
                            <IconButton onTouchTap={props.onDelete.bind(null, t)}>
                                <DeleteIcon color="#666"/>
                            </IconButton>
                            <IconButton onTouchTap={e => browserHistory.push('team/edit')}>
                                <SetIcon color="#666"/>
                            </IconButton>
                        </div>
                    }
                </li>)
            }
        </ul>
    );
};

module.exports = React.createClass({
    getInitialState() {
        return {showCreate: false};
    },
    componentDidMount() {
        fetch('/api/team/myList')
            .then(d => {
                this.setState({
                    myTeams: d.teams
                });
            });
        fetch('/api/team/followList')
            .then(d => {
                this.setState({
                    followTeams: d.teams
                });
            });
    },
    render() {
        let barConf = {
            title: '群组',
            iconElementRight: <IconButton onTouchTap={e => this.setState({showCreate: true})}><AddIcon/></IconButton>
        };
        let actions = [
            <FlatButton
                primary
                label="取消"
                onTouchTap={e => this.setState({showCreate: false})}/>,
            <FlatButton
                disabled={!this.state.createName}
                primary
                label="确定"
                onTouchTap={this._createTeam}/>
        ];
        return (
            <RespBox className={style} barConf={barConf}>
                {
                    this.state.myTeams && this.state.myTeams.length &&
                    [
                        <Subheader key="0">我所在的小组</Subheader>,
                        <Teams key="1" list={this.state.myTeams} onDelete={this._deleteTeam}/>
                    ]
                }
                {
                    this.state.followTeams && this.state.followTeams.length &&
                    [
                        <Subheader key="0">我关注的小组</Subheader>,
                        <Teams key="1" list={this.state.followTeams} onDelete={this._deleteTeam}/>
                    ]
                }
                <Dialog
                    contentStyle={{maxWidth: '450px'}}
                    title="新建小组"
                    actions={actions}
                    open={this.state.showCreate}>
                    <TextField
                        hintText="组名"
                        value={this.state.createName || ''}
                        onChange={e => this.setState({createName: e.target.value})}
                        fullWidth={true}/>
                    <Toggle
                        toggle={!!this.state.createCanBeFollow}
                        onToggle={e => this.setState({createCanBeFollow: e.target.checked})}
                        style={{marginTop: '10px'}}
                        labelPosition="right"
                        label="允许关注"/>
                </Dialog>
            </RespBox>
        );
    },
    _createTeam() {
        fetch('/api/team/create', {
            method: 'post',
            body: {
                name: this.state.createName,
                canBeFollow: this.state.createCanBeFollow
            }
        })
            .then(d => {
                this.setState({
                    showCreate: false,
                    createCanBeFollow: false,
                    createName: false
                });
                popup.success('创建成功');
                browserHistory.push('team/edit');
            })
            .catch(e => {
                popup.error(e.msg || '小组创建失败');
            });
    },
    _deleteTeam(t) {
        popup.confirm({
            msg: '确定删除小组?',
            onOk: () => {
                fetch('/api/team/delete?teamId=' + t.id)
                    .then(d => {
                        _.remove(this.state.myTeams, {id: t.id});
                        this.forceUpdate();
                        popup.success('删除成功');
                    })
                    .catch(e => {
                        popup.success('删除失败');
                    })
            }
        });
    }
});