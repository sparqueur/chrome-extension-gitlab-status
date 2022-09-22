import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.scss';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

render(
  <Options/>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
