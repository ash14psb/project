import React, { useEffect, useState } from "react";
import "./Tours.css";

function Tours() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/tours")
      .then((response) => response.json())
      .then((data) => setTours(data));
  }, []);

  return (
    <main className="tours">
      <h2>Available Tours</h2>
      <div className="tours-grid">
        {tours.map((tour) => (
          <div key={tour.tour_id} className="tour-card">
            <h3>{tour.destination}</h3>
            <p>{tour.description}</p>
            <p>Price: ${tour.price}</p>
            <p>Available Slots: {tour.available_slots}</p>
            <button>Book Now</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Tours;
