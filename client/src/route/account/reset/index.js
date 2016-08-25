module.exports = {
    path: 'reset',
    getComponent(nextState, callback) {
        require.ensure([], function (require) {
            callback(null, require('./component'))
        })
    }
};