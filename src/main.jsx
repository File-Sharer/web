import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PrimeReactProvider } from 'primereact/api';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './store/index.js';
import 'primeicons/primeicons.css';

const value = {
  ripple: true,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <PrimeReactProvider value={value}>
        <App />
        <ToastContainer position='bottom-right' theme='dark' />
      </PrimeReactProvider>
    </BrowserRouter>
  </Provider>,
);
