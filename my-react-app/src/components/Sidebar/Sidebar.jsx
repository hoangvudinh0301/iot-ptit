import { NavLink } from "react-router-dom"
import "./Sidebar.css"
function Sidebar() {
    return (
        <aside className="sidebar">
            <NavLink to="/" className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"}>
                Dashboard
            </NavLink>
            <NavLink to="/data-sensor" className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"}>
                Data Sensor
            </NavLink>
            <NavLink to="/history" className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"}>
                History
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"}>
                Profile
            </NavLink>
        </aside>
    )
}
export default Sidebar