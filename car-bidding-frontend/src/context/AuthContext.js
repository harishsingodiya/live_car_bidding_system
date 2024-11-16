"use client";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, refreshTokenApi } from "../utils/api";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const { data } = await loginUser(username, password);
    setToken(data.token);
    setUser(data.userData);
    localStorage.setItem("token", data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.userData));
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/login");
  };


  // Refresh token function
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await refreshTokenApi(refreshToken);
    const { token } = response.data;

    // Update access token in localStorage
    localStorage.setItem('token', token);

    return true;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return false;
  }
}

// Check if the access token is still valid and refresh it if needed
async function checkAndRefreshToken() {
  const token = localStorage.getItem('token');
  

  if (token) {
    try {
      // Check if the access token is valid (you can implement token expiry check here)
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If the token has expired, try refreshing it
      if (decoded.exp < currentTime) {
        return await refreshToken();
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  return false;
}

  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, user, checkAndRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
