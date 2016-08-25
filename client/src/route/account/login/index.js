module.exports =   {
    path: 'login',
    getComponent(nextState, callback) {
        require.ensure([], function (require) {
            callback(null, require('./component'))
        })
    }
};