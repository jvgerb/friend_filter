import { EventEmitter } from './helpers';
import renderFriends from '../views/friends.hbs';
import renderSelectedfriends from '../views/selected-friends.hbs';

export default class View extends EventEmitter {
    constructor() {
        super();

        // мэппинг между именем шаблона и функцией рендера
        this.renderMap = new Map(
            [
                ['friends-left', renderFriends],
                ['friends-right', renderSelectedfriends]
            ]);

        // мэппинг между именем шаблона и его хтмл-элементом
        this.containerMap = new Map(
            [
                ['friends-left', document.querySelector('#lists-left')],
                ['friends-right', document.querySelector('#lists-right')]
            ]);

        this.searchFriend = document.querySelector('#search_left');
        this.searchSelectedFriend = document.querySelector('#search_right');

        // регистрация обработчиков для связи view с контроллером,
        // т.к. view не имеет полномочий напрямую обновить данные в модели
        // при поиске и перемещении элементов между списками
        this.initListeners();
    }

    /**
     * Заполненняет шаблон из .hbs-файла данными из переданной модели и вставляет их в html страницы
     * @param {string} templateName - имя шаблона 
     * @param {object} model - данные 
     */
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

    renderFriends(friends) {
        this.render('friends-left', friends);
    }

    renderSelectedFriends(friends) {
        this.render('friends-right', friends);
    }

    initListeners() {
        this.searchFriend.addEventListener('keydown', e => this.emit('searchFriend', e.target.value));
        this.searchSelectedFriend.addEventListener('keydown', e => this.emit('searchSelectedFriend', e.target.value));
    }
}