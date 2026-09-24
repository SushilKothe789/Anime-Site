import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./AdminLoginPage.css";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";


const AdminLoginPage = () => {

    const navigate =
        useNavigate();


    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setError("");


            if (
                !username.trim() ||
                !password
            ) {
                setError(
                    "Please enter username and password."
                );

                return;
            }


            try {

                setLoading(true);


                const response =
                    await fetch(
                        `${API_URL}/api/admin/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            credentials:
                                "include",

                            body: JSON.stringify({
                                username:
                                    username.trim(),
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok || !data.ok) {

                    setError(
                        data.message ||
                        "Login failed."
                    );

                    return;
                }


                navigate("/admin");

            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );

                setError(
                    "Unable to connect to server."
                );

            } finally {

                setLoading(false);
            }
        };


    return (
        <div className="admin-login-page">

            <div className="admin-login-card">

                <div className="admin-login-header">

                    <h1>
                        Admin Login
                    </h1>

                    <p>
                        Sign in to access the
                        admin panel.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="admin-login-form"
                >

                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            placeholder="Enter username"
                            autoComplete="username"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter password"
                            autoComplete="current-password"
                        />

                    </div>


                    {error && (
                        <div className="admin-login-error">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
};


export default AdminLoginPage;