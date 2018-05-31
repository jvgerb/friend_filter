import { debounce } from './helpers';

export default class NewController {
    constructor(view, model, vkRepository) {
        this.model = model;
        this.view = view;
        this.vkRepository = vkRepository;

        // регистририуем обработчики событий для связи всех компонентов приложения между собой
        // с помощью событий, адресованных друг к другу
        this.initListerens();

        // логин и начальная загрузка страницы
        this.login()
            .then(this.init())
            .catch((e) => console.error(e));

        // добавляем замедление поиска
        //this.onFriendSearch = debounce(this.onFriendSearch.bind(this), 250);
        // this.onSelectedFriendSearch = debounce(this.onSelectedFriendSearch.bind(this), 250);

        //this.onFriendSearch = this.onFriendSearch;
        //this.onSelectedFriendSearch = this.onSelectedFriendSearch;
    }

    login() {
        return this.vkRepository.login(6491689, 2)
            .then(this.vkRepository.getUser({ name_case: 'gen' }))
            .catch((e) => console.error(e));
    }

    init() {
        this.vkRepository.getFriends({ fields: 'photo_100', order: 'name' })
            .then(response => this.model.init(response.items, []))
            .catch((e) => console.error(e))
    }

    onFriendSearch(searchKey) {
        this.model.filterFriends(searchKey);
    }

    onSelectedFriendSearch(searchKey) {
        this.model.filterSelectedFriends(searchKey);
    }

    initListerens() {
        // при обновлении списка друзей в модели, нужно заставить view перерисовать html
        this.model.on('filteredFriendsUpdated', (friends) => {
            this.view.renderFriends(friends);
        });

        // при обновлении списка друзей в модели, нужно заставить view перерисовать html
        this.model.on('filteredSelectedFriendsUpdated', (friends) => {
            this.view.renderSelectedFriends(friends);
        });

        // при выполнении поиска слева, нужно заставить контроллер обновить модель отфильтрованными данными
        // здесь не вызывается напрямую метод модели filterFriends(searchKey), чтобы была возможность в контроллере
        // добавить debounce при выполнении поиска
        this.view.on('searchFriend', (searchKey) =>
            this.onFriendSearch(searchKey)
            // TODO
            // debounce(() => this.onFriendSearch(searchKey), 500)()
        );

        // при выполнении поиска справа, нужно заставить контроллер обновить модель отфильтрованными данными
        // здесь не вызывается напрямую метод модели filterSelectedFriends(searchKey), чтобы была возможность в контроллере
        // добавить debounce при выполнении поиска
        this.view.on('searchSelectedFriend', (searchKey) =>
            this.onSelectedFriendSearch(searchKey));
    }
}