import React from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "../../styles/globals.css";
import NavBar from "@/components/NavBar";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const tempToken = token || localStorage.getItem("token");
    if (!tempToken) {
      router.push("/login"); // Redirects to login if not authenticated
    }
  }, [token, router]);

  return token ? children : null; // Renders children only if token exists
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      {Component.auth ? (
        <ProtectedRoute>
          <NavBar />
          <div className="container mx-auto">
            <Component {...pageProps} />
          </div>
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}
