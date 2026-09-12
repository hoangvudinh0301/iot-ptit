import React, {useState, useEffect}from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import DataSensor from "./pages/DataSensor/DataSensor";
import Layout from "./components/Layout/Layout";
import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";

function App()
{
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/data-sensor" element={<DataSensor />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}
export default App;