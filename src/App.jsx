import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadEvents } from "./redux/store";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./components/Home/Home.jsx";
import Calender from "./components/Calender/Calender.jsx";
import UserLogin from "./components/UserLogin/UserLogin.jsx";
import Events from './components/Events/Events.jsx';
import MyEvents from './components/Events/myEvents/MyEvents.jsx';
import AllEvents from './components/Events/allEvents/AllEvents.jsx';
const App = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false
  );

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(JSON.parse(localStorage.getItem("isLoggedIn")) || false);
    };

    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  return (
    <div data-testid="App" className="App">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>

      <Route path="/" element={<Home />} />
        <Route path="/Calender" element={isLoggedIn ? <Calender /> : <Navigate to="/UserLogin" replace />} />
        <Route path="/UserLogin" element={<UserLogin setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/Events/*" element={isLoggedIn ? <Events /> : <Navigate to="/UserLogin" replace />}>
          <Route path="AllEvents" element={<AllEvents />} />
          <Route path="MyEvents" element={<MyEvents />} />
        </Route>        
      </Routes>

      


    </div>
  );
};

export default App;
