import React, {useState, useEffect}from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import DataSensor from "./pages/DataSensor/DataSensor";
import Layout from "./components/Layout/Layout";
import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login"
function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/data-sensor" element={<DataSensor />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
export default App;