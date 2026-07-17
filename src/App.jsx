import { createRoot } from 'react-dom/client';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Home} from './pages/home'
import {Login} from './pages/login'

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/home" element={<Home/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
