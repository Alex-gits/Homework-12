// Создать функцию, которая возвращает промис.  Функция принимает два аргумента - время, через которое промис должен выполниться, и значение, с которым промис будет выполнен.

// function promiseCreator(...) {...}
// const prom = promiseCreator(500, 'Ok!');
// prom.then(console.log);
// Ok!



function promiseCreator(value, time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(value)
        }, time);
    })
}

const prom = promiseCreator('OK!', 2000);
prom.then((value) => console.log(value));


// -----------------------------------------------------------------------------------------------------
// Переписать данную функцию на fetch и промисы

function http() {
    return {
        get(url, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                xhr.send();
            } catch (error) {
                cb(error);
            }
        },
        post(url, body, headers, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                }

                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error);
            }
        },
    };
}


// Первый способ:


function http2() {
    return {
        get(url) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.send();

                xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
                xhr.addEventListener('error', () => reject({ status: xhr.status, url }));
            });
        },
        post(url, body) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);

                xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
                xhr.addEventListener('error', () => reject({ status: xhr.status, url }));

                xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
                xhr.send(JSON.stringify(body));
            });
        },
    };
}

const ajaxRequests = http2();

const newItem = {
    name: 'Alex',
    email: 'test@test.com',
    username: 'Time',
    phone: 404812323,
    website: 'test.test'
};

ajaxRequests.post('https://jsonplaceholder.typicode.com/users', newItem)
    .then(res => console.log(res))
    .catch(err => console.log(err));



// Второй способ. Более короткий:


function getRequest(url, method, body) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
        xhr.addEventListener('error', () => reject({ status: xhr.status, url }));
        if (method === 'get') {
            xhr.send();
        } else {
            xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
            xhr.send(JSON.stringify(body));
        }
    });
}

const newUser = {
    name: 'Alex',
    email: 'test@test.com',
    username: 'Time',
    phone: 404812323,
    website: 'test.test'
};

getRequest('https://jsonplaceholder.typicode.com/users', 'post', newUser)
    .then(res => console.log(res))
    .catch(err => console.log(err));



// Через fetch:


function fetchFnc() {
    return {
        get(url) {
            return fetch(url);
        },
        post(url, item) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(item)
            });
        },
    };
}


const fetchRequest = fetchFnc();

const newObj = {
    name: 'Alex',
    email: 'test@test.com',
    username: 'Time',
    phone: 404812323,
    website: 'test.test'
};

fetchRequest.post('https://jsonplaceholder.typicode.com/users', newObj)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch((err) => console.log(err));