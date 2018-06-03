/**
 * debounce - Функция "Дебаунс", разрешает вызывать функцию не чаще чем в заданно евремя
 * Время обновляется при повторном вызове функции
 * @param  {Function} f  Функция
 * @param  {type}     ms Задержка
 * @return {Function} Функция дебаунс
 */
export default function debounce(f, ms) {
    let timer = null;

    return function fn(...args) {
        const onComplete = () => {
            f.apply(this, args);
            timer = null;
        };

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, ms);
    };
}