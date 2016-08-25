module.exports = {
    path: 'report',
    getComponent(nextState, callback) {
        require.ensure([], function (require) {
            callback(null, require('./component'))
        })
    }
};