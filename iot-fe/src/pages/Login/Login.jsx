
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Sai tài khoản hoặc mật khẩu");
                }

                throw new Error(
                    `Đăng nhập thất bại: HTTP ${response.status}`
                );
            }

            const data = await response.json();

            if (!data.accessToken) {
                throw new Error("Backend không trả về accessToken");
            }

            sessionStorage.setItem(
                "accessToken",
                data.accessToken
            );

            console.log("Đăng nhập thành công");

            // Chuyển sang Dashboard
            navigate("/dashboard", { replace: true });

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login-box">
                <h3>Đăng nhập</h3>

                <form onSubmit={handleLogin}>
                    <div className="login-group">
                        <label htmlFor="username">
                            Tài khoản
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="Nhập tài khoản"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-group">
                        <label htmlFor="password">
                            Mật khẩu
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
