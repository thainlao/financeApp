import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { setupStore } from './store/store';
import App from './App';


const store = setupStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
