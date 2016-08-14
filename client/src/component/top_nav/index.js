/**
 * 一级导航
 */
import React from 'react';
import {Drawer} from 'material-ui';
import {style} from './index.scss';

export default React.createClass({
    getInitialState() {
        return {open: false};
    },
    render() {
        return (
            <Drawer
                className={style}
                open={this.props.forceOpen || this.props.open}
                onRequestChange={this.props.onRequestChange}>
                <h1>简报</h1>
            </Drawer>
        );
    }
});