import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ImageUpload from './ImageUpload';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<ImageUpload />, document.getElementById('root'));
registerServiceWorker();
