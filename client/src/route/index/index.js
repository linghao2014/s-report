module.exports = {
    path: 'index',
    onEnter(nextState, replace) {
        if(_user.id) {
            if(_user.groupId) {
                replace('/report');
            } else {
                replace('/guide');
            }
        }
    },
    getComponent(nextState, callback) {
        require.ensure([], function (require) {
            callback(null, require('./component'))
        })
    }
};