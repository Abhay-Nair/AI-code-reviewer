import React, { useState } from "react";
import axios from "axios";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/auth/verify-otp", { email, otp });
      setMessage("OTP verified! Now reset your password.");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerify}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
        <button type="submit">Verify</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default VerifyOTP;
