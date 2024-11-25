import React from "react";
import { useParams } from "react-router-dom";

function Booking() {
  const { tourId } = useParams();

  const handleBooking = () => {
    console.log("Booking tour:", tourId);
    // Implement backend API call here
  };

  return (
    <div>
      <h2>Book Tour</h2>
      <p>Tour ID: {tourId}</p>
      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
}

export default Booking;
