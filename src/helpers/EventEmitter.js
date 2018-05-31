/**
 * PubSub
 */
export default class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * on - Действие при возникновении события
     *
     * @param  {String} type        Тип события
     * @param  {Function} listener  Слушатель
     */
    on(type, listener) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(listener);
    }

    /**
     * emit - Тригер события
     *
     * @param  {String} type Тип события
     * @param  {any} arg     Данные для слушателя
     */
    emit(type, arg) {
        if (this.events[type]) {
            this.events[type].forEach(listener => listener(arg));
        }
    }
}