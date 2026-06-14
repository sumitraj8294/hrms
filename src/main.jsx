import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import { store } from './store'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Plus Jakarta Sans', fontSize: '13px' } }} />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
