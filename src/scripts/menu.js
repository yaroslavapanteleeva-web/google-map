import { close, open } from "./utils";

const $menuClose = document.querySelector('#menu-close');
const $menu = document.querySelector('.left-panel');

$menuClose.addEventListener('click', () => {
    close($menu);
})