import React from "react";
import { useNavigate } from "react-router-dom";
import Payment from "./Payment";

export default function BuyNow() {
  const navigate = useNavigate();
  
  // This component is now just a redirect to Payment
  // The actual payment logic is in Payment.jsx
  // This route is kept for backward compatibility
  return <Payment />;
}
