import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import './App.css'
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {

  return (
   <div className='App'>
    <Router>
      <Routes>
       <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
   </div>
     
     


  )
}

export default App;
