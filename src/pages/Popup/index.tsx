import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.scss';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
