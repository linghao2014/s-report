/**
 * server 相关配置
 */
module.exports = {
    server: {
        listenPort: 8005,
        secret: 'REPORT_U'
    },
    db: {
        url: 'mongodb://127.0.0.1:27017/report'
    },
    mail: {
        host: 'smtp.163.com',
        port: 465,
        secure: true,
        auth: {
            user: 'llwwtest2@163.com',
            pass: 'qrkleqszhqbxpipq'
        }
    }
};