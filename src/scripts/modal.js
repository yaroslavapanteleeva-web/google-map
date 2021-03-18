import { close, open } from "./utils";

const $openModal = document.querySelector('#search-location');
const $modal = document.querySelector('#modal');
const $closeModal = document.querySelector('#modal-close');

const $openList = document.querySelector('#locations');
const $list = document.querySelector('#list');
const $closeList = document.querySelector('#list-close');

$openModal.addEventListener('click', () => {
    open($modal);
});

$closeModal.addEventListener('click', () => {
    close($modal);
})

$openList.addEventListener('click', () => {
    open($list);
})

$closeList.addEventListener('click', () => {
    close($list);
})