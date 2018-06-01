/**
 * Класс предоставляет доступ к данным в localStorage
 */
export default class LocalReporsitory {

    getFriendsList() {
        if (!localStorage.selectedFriends) {
            return [];
        }

        return JSON.parse(localStorage.selectedFriends) || [];
    }

    saveFriendsList(friends) {
        localStorage.selectedFriends = JSON.stringify(friends);
    }

    deleteFriendsList() {
        localStorage.selectedFriends = [];
    }
}