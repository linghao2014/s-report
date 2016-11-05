/**
 * 富文本编辑组件
 */
import React from 'react';
import scss from './index.scss';

export default React.createClass({
    shouldComponentUpdate() {
        return false;
    },
    componentDidMount() {
        this.innerDoc = this._getDoc();
        this.innerDoc.body.contentEditable = true;
        this.innerDoc.head.innerHTML = '<style>body{font-size: 14px; line-height:1.5em;color: #555;}ul,ol{padding-left: 25px;}</style>';
        this.innerDoc.body.innerHTML = this.props.initContent || '';
        this.innerDoc.body.focus();
    },
    render() {
        return (
            <div className={scss.index}>
                <iframe ref="iframe" src="about:blank;"></iframe>
            </div>
        );
    },
    _getDoc() {
        return this.refs.iframe.contentDocument;
    },
    _exec(cmd, param) {
        this.innerDoc.execCommand(cmd, false, param);
        this.innerDoc.body.focus();
    },
    insertOrderedList() {
        this._exec('insertorderedlist');
    },
    insertUnorderedList() {
        this._exec('insertunorderedlist');
    },
    heading(type) {
        this._exec('formatBlock', `<${type}>`);
    },
    getContent() {
        return this.innerDoc.body.innerHTML;
    }
});