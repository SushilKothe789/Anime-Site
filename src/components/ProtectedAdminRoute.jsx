import {
    useEffect,
    useState
} from "react";

import {
    Navigate
} from "react-router-dom";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";


const ProtectedAdminRoute = ({
    children
}) => {

    const [status, setStatus] =
        useState("checking");


    useEffect(() => {

        let cancelled = false;


        const checkAuthentication =
            async () => {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/admin/auth/me`,
                            {
                                credentials:
                                    "include"
                            }
                        );


                    const data =
                        await response.json();


                    if (cancelled) {
                        return;
                    }


                    if (
                        response.ok &&
                        data.ok &&
                        data.authenticated
                    ) {
                        setStatus(
                            "authenticated"
                        );
                    } else {
                        setStatus(
                            "unauthenticated"
                        );
                    }

                } catch (error) {

                    console.error(
                        "Auth check error:",
                        error
                    );

                    if (!cancelled) {
                        setStatus(
                            "unauthenticated"
                        );
                    }
                }
            };


        checkAuthentication();


        return () => {
            cancelled = true;
        };

    }, []);


    if (
        status === "checking"
    ) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0f0f0f",
                    color: "#ffffff"
                }}
            >
                Checking authentication...
            </div>
        );
    }


    if (
        status === "unauthenticated"
    ) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }


    return children;
};


export default ProtectedAdminRoute;