import Header from "../Header";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css"

function Layout({children}) {
    return (
        <div className="layout">
            <Header />
            <div className="layout-body">
                <Sidebar />
                <main className="layout-content">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout