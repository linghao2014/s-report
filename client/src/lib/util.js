/**
 * 工具方法
 */
import 'whatwg-fetch';

export function fetch(url, option) {
    option && option.method && (option.method = option.method.toUpperCase());
    if (option && option.method == 'POST' && typeof option.body == 'object' && !(option.body instanceof FormData)) {
        option.body = JSON.stringify(option.body);
        option.headers = Object.assign({}, option.headers, {'Content-Type': 'application/json'});
    }
    return window.fetch(url, Object.assign({}, option, {credentials: 'include'}))
        .then(resp=> {
            if(resp.status == 200) {
                let data = resp.json();
                if(data.code == 200) {
                    return data;
                } else {
                    throw data;
                }
            } else {
                throw Error('网络错误');
            }
        });
}

export function isMail(str) {
    return /^\w+@\w+/.test(str);
}