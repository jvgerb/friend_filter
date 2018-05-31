/**
 * Application entry point
 */

// Load application styles
import './styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

import NewView from './NewView';
import NewModel from './NewModel';
import NewController from './NewController';
import VKRepository from './VKRepository';

const model = new NewModel();
const view = new NewView();
const vkRepository = new VKRepository(VK);

const controller = new NewController(view, model, vkRepository);

export default controller;