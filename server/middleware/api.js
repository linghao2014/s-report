/**
 * api middleware
 */
'use strict';
module.exports.errorToJson = function () {
    return function*(next) {
        if (this.request.url.startsWith('/api')) {
            try {
                yield* next;
            } catch (e) {
                this.body = {code: 500};
            } finally {
                if(this.response.status == 404) {
                    this.response.status = 200;
                    this.body = {code: 404};
                } else if(this.response.status == 500) {
                    this.response.status = 200;
                    this.body = {code: 500};
                }
            }
        } else {
            yield next;
        }

    }
};