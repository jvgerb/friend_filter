export default function Controller(view, model) {
    return {

        renderFriends: async function() {
            const friends = await model.getFriends({ fields: 'photo_100' });
            view.renderFriends(friends);
        },

        login: async function() {
            try {
                const login = await model.login(6491689, 2);
                const me = await model.getUser({ name_case: 'gen' });

                view.renderHeader(me[0]);

            } catch (e) {
                console.error(e);
                alert('Ошибка: ' + e.message);
            }
        }
    }

};

// задача - прослойка между model и view