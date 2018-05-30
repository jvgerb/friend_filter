import friendsRenderFunc from '../views/friends.hbs';

export default function View() {

    // мэппинг между именем шаблона и функцией рендера
    const renderMap = new Map(
        [
            ['friends-left', friendsRenderFunc],
            //['header', headerRenderFunc]
        ]);

    // мэппинг между именем шаблона и его хтмл-элементом
    const containerMap = new Map(
        [
            ['friends-left', document.querySelector('#lists-left')],
            //['header', document.querySelector('#headerInfo')]
        ]);

    /**
     * Возвращает html-текст шаблона, заполненного данными из переданной модели
     * @param {string} templateName - имя шаблона 
     * @param {object} model - данные 
     */
    const render = (templateName, model) => {
        const renderFunc = renderMap.get(templateName),
            htmlContainer = containerMap.get(templateName);

        if (!renderFunc) {
            throw new Error(`Не зарегистрирован метод рендера для шаблона ${templateName}`);
        } else if (!htmlContainer) {
            throw new Error(`Не зарегистрирован html-контейнер для шаблона ${templateName}`);
        } else {
            htmlContainer.innerHTML = renderFunc(model);
        }
    };

    return {
        renderFriendsLeft(friends) {
            render('friends-left', friends);
        }
    };
}

// задача - отображение данных