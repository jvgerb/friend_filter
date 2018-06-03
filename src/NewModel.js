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

    // получение значения свойства field из модели
    read(field) {
        return this[field];
    }

    // поиск всех элементов в массиве modelField, чье поле searchField содержит в себе подстроку value
    searchBy({ modelField, searchField, value }) {

        return this[modelField].filter((item) => {
            const itemField = item[searchField].toLowerCase();

            return itemField.includes(value.toLowerCase());
        });
    }

    // обновление свойства field модели значением data с последующим оповещением
    // в случае обновления левого и правого видимого списка друзей
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

        // добавляем левому списку друзей поле name, более удобное для поиска по строке
        addNameField(friends);

        // если в сохраненном списке есть друзья, то надо их убрать из левого списка
        if (selectedFriends.length > 0) {
            selectedFriends.forEach(item => {
                const index = getFriendIndexById(friends, item.id);

                friends.splice(index, 1);
            })
        }

        this.update('friends', friends);
        this.update('filteredFriends', [...friends]);
        this.update('selectedFriends', selectedFriends);
        this.update('filteredSelectedFriends', [...selectedFriends]);
    }

    // фильтрация левого списка друзей
    filterFriends(searchKey) {
        if (!searchKey) {
            this.update('filteredFriends', [...this.friends]);

            return;
        }
        const filtered = this.searchBy({
            modelField: 'friends',
            searchField: 'name',
            value: searchKey
        });

        this.update('filteredFriends', [...filtered]);
    }

    // фильтрация правого списка друзей
    filterSelectedFriends(searchKey) {
        if (!searchKey) {
            this.update('filteredSelectedFriends', [...this.selectedFriends]);

            return;
        }

        const filtered = this.searchBy({
            modelField: 'selectedFriends',
            searchField: 'name',
            value: searchKey
        });

        this.update('filteredSelectedFriends', [...filtered]);
    }

    // перенос друга из левого списка в правый
    selectFriend(id) {
        // удаляем друга из общего и фильтрованного списка людей слева
        const leftFriendIndex1 = getFriendIndexById(this.friends, id),
            leftFriend1 = this.friends.splice(leftFriendIndex1, 1)[0];

        const leftFriendIndex2 = getFriendIndexById(this.filteredFriends, id),
            leftFriend2 = this.filteredFriends.splice(leftFriendIndex2, 1)[0];

        // добавляем друга в общий и фильтрованный список справа
        this.selectedFriends.push(leftFriend1);
        this.filteredSelectedFriends.push(leftFriend2);

        // оповещаем вью о необходимости перестроить списки
        this.emit('filteredFriendsUpdated', this.filteredFriends);
        this.emit('filteredSelectedFriendsUpdated', this.filteredSelectedFriends);
    }

    // перенос друга из правого списка в левый
    deselectFriend(id) {
        // удаляем друга из общего и фильтрованного списка людей справа
        const rightFriendIndex1 = getFriendIndexById(this.selectedFriends, id),
            rightFriend1 = this.selectedFriends.splice(rightFriendIndex1, 1)[0];

        const rightFriendIndex2 = getFriendIndexById(this.filteredSelectedFriends, id),
            rightFriend2 = this.filteredSelectedFriends.splice(rightFriendIndex2, 1)[0];

        // добавляем друга в общий и фильтрованный список слева
        this.friends.push(rightFriend1);
        this.filteredFriends.push(rightFriend2);

        // оповещаем вью о необходимости перестроить списки
        this.emit('filteredFriendsUpdated', this.filteredFriends);
        this.emit('filteredSelectedFriendsUpdated', this.filteredSelectedFriends);
    }
}

/**
 * Добавляет в массив друзей friends поле name для облегчения поиска
 * @param {*} friends 
 */
function addNameField(friends) {
    friends.forEach(el => {
        el.name = `${el.first_name} ${el.last_name}`;
    });

    return friends;
}

/**
 * Возвращает номер элемента в массиве list, у которого свойство id имеет указанное значение
 * @param {*} list 
 * @param {*} id 
 */
function getFriendIndexById(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            return i;
        }
    }
}