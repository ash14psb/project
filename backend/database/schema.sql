-- Users Table
CREATE TABLE Users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Admin', 'Customer', 'Travel Agent')) NOT NULL
);

-- Tours Table
CREATE TABLE Tours (
    tour_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    destination VARCHAR2(100) NOT NULL,
    description CLOB,
    price NUMBER(10, 2) NOT NULL,
    available_slots NUMBER NOT NULL,
    created_by NUMBER,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- Bookings Table
CREATE TABLE Bookings (
    booking_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT,
    tour_id INT,
    booking_date DATE DEFAULT SYSDATE,
    status VARCHAR(20) DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Cancelled')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (tour_id) REFERENCES Tours(tour_id)
);

-- Payments Table
CREATE TABLE Payments (
    payment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE DEFAULT SYSDATE,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
);

-- Reviews Table
CREATE TABLE Reviews (
    review_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER,
    tour_id NUMBER,
    review_text CLOB,
    rating NUMBER CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (tour_id) REFERENCES Tours(tour_id)
);
