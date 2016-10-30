module.exports = function (code, msg) {
    this.code = code;
    this.msg = msg;
};

module.exports.ErrCode = {
    ABSENCE_PARAM: 400,
    INVALID_PARAM: 410,
    SERVER_ERROR: 500
};