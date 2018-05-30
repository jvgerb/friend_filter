/**
 * Application entry point
 */

// Load application styles
import './styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

import View from './View';
import Model from './Model';
import Controller from './Controller';

const model = new Model(VK);
const view = new View();

const controller = new Controller(view, model);

(async() => {
    try {
        const login = await controller.login();
        const fr = await controller.renderFriends();
    } catch (e) {
        console.error(e);
    }
})();

export default controller;