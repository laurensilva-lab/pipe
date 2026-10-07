import { Header, bindMenu } from './components/Header.js';
import { Footer } from './components/Footer.js';

const app = document.querySelector('#app');
app.insertAdjacentHTML('afterbegin', Header());
app.insertAdjacentHTML('beforeend', Footer());
bindMenu();
