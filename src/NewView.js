import { EventEmitter } from './helpers';
import renderFriends from '../views/friends.hbs';
import renderSelectedfriends from '../views/selected-friends.hbs';

/**
 * Класс представления
 */
export default class View extends EventEmitter {
    constructor() {
        super();

        this.searchFriend = document.querySelector('#search_left');
        this.searchSelectedFriend = document.querySelector('#search_right');
        this.listLeft = document.querySelector('#lists-left');
        this.listRight = document.querySelector('#lists-right');
        this.saveBtn = document.querySelector('#save');
        this.deleteBtn = document.querySelector('#delete');
        this.leftPanel = document.querySelector('#lists-left-panel');
        this.rightPanel = document.querySelector('#lists-right-panel');

        // мэппинг между именем шаблона и функцией рендера
        this.renderMap = new Map(
            [
                ['friends-left', renderFriends],
                ['friends-right', renderSelectedfriends]
            ]);

        // мэппинг между именем шаблона и его хтмл-элементом
        this.containerMap = new Map(
            [
                ['friends-left', this.listLeft],
                ['friends-right', this.listRight]
            ]);

        // регистрация обработчиков для связи view с контроллером,
        // т.к. view не имеет полномочий напрямую обновить данные в модели
        // при поиске и перемещении элементов между списками
        this.initListeners();
    }

    // заполнить левый список друзей
    renderFriends(friends) {
        this.render('friends-left', friends);
    }

    // заполнить правый список друзей
    renderSelectedFriends(friends) {
        this.render('friends-right', friends);
    }

    // Заполненняет шаблон из .hbs-файла данными из переданной модели и вставляет их в html страницы
    render(templateName, model) {
        const renderFunc = this.renderMap.get(templateName),
            htmlContainer = this.containerMap.get(templateName);

        if (!renderFunc) {
            throw new Error(`Не зарегистрирован метод рендера для шаблона ${templateName}`);
        } else if (!htmlContainer) {
            throw new Error(`Не зарегистрирован html-контейнер для шаблона ${templateName}`);
        } else {
            // нельзя просто передать массив друзей, шаблон ожидает объект с данными в свойстве items
            htmlContainer.innerHTML = renderFunc({ items: model });
        }
    }

    // показать юзеру сообщение
    notifyUser(message) {
        alert(message);
    }

    initListeners() {
        // поиск слева
        this.searchFriend.addEventListener('keyup', e =>
            this.emit('searchFriend', e.target.value));

        // поиск справа
        this.searchSelectedFriend.addEventListener('keyup', e =>
            this.emit('searchSelectedFriend', e.target.value));

        // добавление друга
        this.listLeft.addEventListener('click', e => {
            if (e.target.tagName === 'IMG' && e.target.getAttribute('alt') === 'plus') {
                this.emit('selectFriend', e.target.getAttribute('name'));
            }
        });

        // удаление друга
        this.listRight.addEventListener('click', e => {
            if (e.target.tagName === 'IMG' && e.target.getAttribute('alt') === 'minus') {
                this.emit('deselectFriend', e.target.getAttribute('name'));
            }
        });

        // сохранение правого списка
        this.saveBtn.addEventListener('click', e => {
            this.emit('save', e.target);
        });

        // удаление правого списка
        this.deleteBtn.addEventListener('click', e => {
            this.emit('delete', e.target);
        });

        setupDnD([this.leftPanel, this.rightPanel], this);
    }
}

/**
 * Настройка drag'n'drop для правого и левого списка друзей
 * @param {Array} items - левый и правый div, содержащие в себе списки друзей
 */
function setupDnD(items, self) {
    let currentDrag;

    items.forEach(item => {

        // захват дива с другом 
        item.addEventListener('dragstart', e => {
            currentDrag = { source: item, friendId: e.target.getAttribute('name') };
        });

        // перетаскивание дива
        item.addEventListener('dragover', e => {
            e.preventDefault();
        });

        // перетаскивание дива
        // item.addEventListener('dragenter', e => {
        //     e.preventDefault();

        //     return false;
        // });

        // отпускание дива с другом
        item.addEventListener('drop', e => {
            if (currentDrag) {
                e.preventDefault();

                if (currentDrag.source !== item) {
                    if (item.getAttribute('id') === 'lists-right-panel') {
                        // если отпустили над правой панелью, добавляем друга в список
                        self.emit('selectFriend', currentDrag.friendId);
                    } else if (item.getAttribute('id') === 'lists-left-panel') {
                        // если отпустили над левой панелью, удаляем друга из списка
                        self.emit('deselectFriend', currentDrag.friendId);
                    }

                    currentDrag = null;
                }
            }
        });
    });
}