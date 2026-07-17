import { createRoot } from 'react-dom/client';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Home} from './pages/home'
import {Login} from './pages/login'
import {Register} from './pages/register'

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
