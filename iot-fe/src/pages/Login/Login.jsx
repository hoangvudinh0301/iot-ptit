import { useNavigate } from "react-router-dom"
import {useState} from "react"
import "./Login.css"

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "123456") {
            navigate("/dashboard")
        } else {
            alert("Sai tài khoản hoặc mật khẩu")
        }
    };
    return (
        <div className="login">
            <div className="login-box">
                <h3>Đăng nhập</h3>
                <form action="" onSubmit={handleLogin}>
                    <div className="login-group">
                        <label htmlFor="">Tài khoản</label>
                        <input type="text" placeholder="Nhập tài khoản" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="login-group">
                        <label htmlFor="">Mật khẩu</label>
                        <input type="text" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}

export default Login