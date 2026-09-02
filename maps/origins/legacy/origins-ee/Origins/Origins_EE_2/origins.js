const headerNav = document.querySelector('.header_container');

const fireNav = document.querySelector('.fire_nav');
const iceNav = document.querySelector('.ice_nav');
const lightningNav = document.querySelector('.lightning_nav');
const windNav = document.querySelector('.wind_nav');

const cloneNav = headerNav.cloneNode(true);
fireNav.appendChild(cloneNav);
