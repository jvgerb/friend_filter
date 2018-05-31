import { EventEmitter } from './helpers';
/**
 * Model - Базовый класс модели
 */
export default class NewModel extends EventEmitter {
    constructor() {
        super();

        // список друзей, загруженных из ВК
        this.friends = [];

        // сохраненный список друзей
        this.selectedFriends = [];

        // список друзей, загруженных из ВК, после применения фильтрации
        this.filteredFriends = [];

        // сохраненный список друзей после применения фильтрации
        this.filteredSelectedFriends = [];
    }

    read(field) {
        return this[field];
    }

    searchBy({ modelField, searchField, value }) {
        console.log(value);

        return this[modelField].filter((item) => {
            const itemField = item[searchField].toLowerCase();

            return !!~itemField.indexOf(value.toLowerCase());
        });
    }

    update(field, data) {
        this[field] = data;

        // оповещаем view об изменении списка друзей слева
        if (field === 'filteredFriends') {
            this.emit('filteredFriendsUpdated', this[field]);
        }

        // оповещаем view об изменении списка друзей справа
        if (field === 'filteredSelectedFriends') {
            this.emit('filteredSelectedFriendsUpdated', this[field]);
        }

        // при изменении this.friends и this.selectedFriends обновлять view не нужно
    }

    // инициализация модели выполняется из контроллера при старте приложения
    // friends - грузятся из VK
    // selectedFriends - грузятся из localStorage
    init(friends, selectedFriends) {

        this.addNameField(friends);

        this.update('friends', friends);
        this.update('filteredFriends', friends);
        this.update('selectedFriends', selectedFriends);
        this.update('filteredSelectedFriends', selectedFriends);
    }

    // добавляет в массив друзей поле name для облегчения поиска
    addNameField(friends) {
        friends.forEach(el => {
            el.name = `${el.first_name} ${el.last_name}`;
        });

        return friends;
    }

    filterFriends(searchKey) {
        console.log(searchKey);
        if (!searchKey) {
            this.update('filteredFriends', this.friends);

            return;
        }

        const filtered = this.searchBy({
            modelField: 'friends',
            searchField: 'name',
            searchKey
        });

        this.update('filteredFriends', filtered);
    }

    filterSelectedFriends(searchKey) {
        if (!searchKey) {
            this.update('filteredSelectedFriends', this.selectedFriends);

            return;
        }

        const filtered = this.searchBy({
            modelField: 'selectedFriends',
            searchField: 'name',
            searchKey
        });

        this.update('filteredSelectedFriends', filtered);
    }
}