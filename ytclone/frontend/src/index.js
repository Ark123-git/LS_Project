
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MessageProvider } from './components/MessageProvider';
import MessageBox from './components/MessageBox';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <MessageProvider>
    <MessageBox />
    <App />
  </MessageProvider>
);
