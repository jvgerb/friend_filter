import { debounce } from './helpers';

/**
 * Контроллер приложения. Синхронизирует модель и представление,
 * работает с источниками данных
 */
export default class NewController {
    constructor(view, model, vkRepository, localRepository) {
        this.model = model;
        this.view = view;
        this.vkRepository = vkRepository;
        this.localRepository = localRepository;

        // регистририуем обработчики событий для связи всех компонентов приложения между собой
        // с помощью событий, адресованных друг к другу
        this.initListerens();

        // логин и начальная загрузка страницы
        this.login()
            .then(this.init())
            .catch((e) => console.error(e));

        // добавляем замедление поиска
        this.onFriendSearch = debounce(this.onFriendSearch.bind(this), 250);
        this.onSelectedFriendSearch = debounce(this.onSelectedFriendSearch.bind(this), 250);
    }

    // авторизация в ВК
    login() {
        return this.vkRepository.login(6491689, 2)
            .then(this.vkRepository.getUser({ name_case: 'gen' }))
            .catch((e) => console.error(e));
    }

    // первоначальная загрузка данных страницы
    init() {
        this.vkRepository.getFriends({ fields: 'photo_100', order: 'name' })
            .then(response => this.model.init(response.items, this.localRepository.getFriendsList()))
            .catch((e) => console.error(e))
    }

    // поиск друга слева (будет обернут в debounce)
    onFriendSearch(searchKey) {
        this.model.filterFriends(searchKey);
    }

    // поиск друга справа (будет обернут в debounce)
    onSelectedFriendSearch(searchKey) {
        this.model.filterSelectedFriends(searchKey);
    }

    // сохранение правого списка в localStorage
    onSave() {
        try {
            this.localRepository.saveFriendsList(this.model.read('selectedFriends'));
            this.view.notifyUser('Список друзей сохранен успешно!');
        } catch (e) {
            this.view.notifyUser(`Ошибка при сохранении данных: ${e}`);
        }
    }

    // удаление правого списка из localStorage
    onDelete() {
        try {
            this.localRepository.deleteFriendsList();
            this.view.notifyUser('Список друзей удален из памяти успешно!');
        } catch (e) {
            this.view.notifyUser(`Ошибка при удалении данных: ${e}`);
        }
    }

    // инициализация обработчиков событий
    initListerens() {
        // при обновлении левого списка друзей в модели, нужно заставить view перерисовать html
        this.model.on('filteredFriendsUpdated', (friends) => {
            this.view.renderFriends(friends);
        });

        // при обновлении правого списка друзей в модели, нужно заставить view перерисовать html
        this.model.on('filteredSelectedFriendsUpdated', (friends) => {
            this.view.renderSelectedFriends(friends);
        });

        // при выполнении поиска слева, нужно заставить контроллер обновить модель отфильтрованными данными
        // здесь не вызывается напрямую метод модели filterFriends(searchKey), чтобы была возможность в контроллере
        // добавить debounce при выполнении поиска
        this.view.on('searchFriend', (searchKey) =>
            this.onFriendSearch(searchKey)
        );

        // при выполнении поиска справа, нужно заставить контроллер обновить модель отфильтрованными данными
        // здесь не вызывается напрямую метод модели filterSelectedFriends(searchKey), чтобы была возможность в контроллере
        // добавить debounce при выполнении поиска
        this.view.on('searchSelectedFriend', (searchKey) =>
            this.onSelectedFriendSearch(searchKey));

        // добавление друга в правый список (и его исключение из левого списка)
        this.view.on('selectFriend', (id) =>
            this.model.selectFriend(id)
        );

        // удаление друга из правого списка (и его возврат в левый список)
        this.view.on('deselectFriend', (id) =>
            this.model.deselectFriend(id)
        );

        // сохранение правого списка
        this.view.on('save', () => {
            this.onSave();
        });

        // удаление правого списка
        this.view.on('delete', () => {
            this.onDelete();
        });
    }
}