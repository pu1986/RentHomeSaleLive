// frontend/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
        );
        setMessage(data.message || "Email verified successfully!");
        setStatus("success");

        // ✅ 3 sec baad login page pe redirect
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setMessage(
          err.response?.data?.message ||
            "Verification link is invalid or expired."
        );
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>

        {status === "loading" && (
          <p className="text-blue-500 font-medium animate-pulse">{message}</p>
        )}
        {status === "success" && (
          <p className="text-green-600 font-medium">{message}</p>
        )}
        {status === "error" && (
          <p className="text-red-600 font-medium">{message}</p>
        )}

        {status === "success" && (
          <p className="mt-3 text-sm text-gray-500">
            Redirecting to login page...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
