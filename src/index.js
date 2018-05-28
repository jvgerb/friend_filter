// 1) регистрация приложения -> получение api id
// 2) авторизоваться на сайте
//   - открыть окно с запросом прав
//   - разрешить выполнять действия от нашего имени

import templateFunc from '../friends.hbs';
import 'styles.css';

VK.init({
    apiId: 6491689
});

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);

            } else {
                resolve(data.response);
            }
        });
    })
}

(async() => {
    try {
        await auth();
        const [me] = await callAPI('users.get', { name_case: 'gen' });
        const headerInfo = document.querySelector('#headerInfo');

        headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;

        var friends = await callAPI('friends.get', { fields: 'city, country, photo_100', order: 'name' });

        const html = templateFunc(friends);
        const results = document.querySelector('#results');
        results.innerHTML = html;

    } catch (e) {
        console.error(e);
    }
})();