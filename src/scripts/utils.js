export function open(selector) {
    return selector.classList.add('open');
}

export function close(selector) {
    return selector.classList.remove('open');
}