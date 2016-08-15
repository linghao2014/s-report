/**
 * 响应式容器,可根据视窗调整显示
 */
import React from 'react';
import {AppBar} from 'material-ui';
import Overlay from 'material-ui/internal/Overlay';
import TopNav from '../top_nav';

const barStyle = {boxShadow: 0};
let requestId;

export default React.createClass({
    getInitialState() {
        return {forceOpen: false, open: false};
    },
    componentWillMount() {
        this._calcOpen();
    },
    componentDidMount() {
        window.onresize = this._onWinResize
    },
    render() {
        let barConf = this.props.barConf;
        return (
            <div>
                <AppBar
                    style={barStyle}
                    onLeftIconButtonTouchTap={this._toggleOpen}
                    {...barConf}/>
                <Overlay
                    lock
                    onTouchTap={evt=>this.setState({open: false})}
                    show={!this.state.forceOpen && this.state.open}
                    style={{zIndex: 1200}}/>
                <TopNav
                    onRequestChange={open=>this.setState({open: open})}
                    open={this.state.open}
                    forceOpen={this.state.forceOpen}/>
                <div
                    className={this.props.className}
                    style={{marginLeft: this.state.forceOpen ? '256px' : 0}}>
                    {this.props.children}
                </div>
            </div>
        );
    },
    _toggleOpen() {
        this.setState({
            open: true
        });
    },
    _calcOpen() {
        var forceOpen = document.body.clientWidth > 980;
        if (forceOpen != this.state.forceOpen) {
            this.setState({
                open: false,
                forceOpen: forceOpen
            });
        }
    },
    _onWinResize() {
        if (requestId) {
            window.cancelAnimationFrame(requestId);
        }
        window.requestAnimationFrame(this._calcOpen)
    }
});