module.exports = {
    path: 'index',
    getComponent(nextState, callback) {
        require.ensure([], function (require) {
            callback(null, require('./component'))
        })
    }
};