/**
 * Класс предоставляет доступ к данным в localStorage
 */
export default class LocalReporsitory {

    getFriendsList() {
        return localStorage.selectedFriends ?
            JSON.parse(localStorage.selectedFriends) :
            [];
    }

    saveFriendsList(friends) {
        localStorage.selectedFriends = JSON.stringify(friends);
    }

    deleteFriendsList() {
        localStorage.selectedFriends = null;
    }
}