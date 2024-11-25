-- Insert Users
INSERT INTO Users (username, password, role) VALUES ('admin', 'admin123', 'Admin');
INSERT INTO Users (username, password, role) VALUES ('customer1', 'cust123', 'Customer');
INSERT INTO Users (username, password, role) VALUES ('agent1', 'agent123', 'Travel Agent');

-- Insert Tours
INSERT INTO Tours (destination, description, price, available_slots, created_by)
VALUES 
('Dhaka', 'Explore the vibrant capital of Bangladesh.', 100.00, 10, 3),
('Cox"s Bazar', 'Relax on the longest sea beach in the world.', 200.00, 15, 3),
('London', 'Discover the iconic landmarks of London.', 500.00, 5, 3);

-- Insert Bookings
INSERT INTO Bookings (user_id, tour_id, status) VALUES (2, 1, 'Confirmed');

-- Insert Payments
INSERT INTO Payments (booking_id, amount) VALUES (1, 100.00);

-- Insert Reviews
INSERT INTO Reviews (user_id, tour_id, review_text, rating)
VALUES (2, 1, 'Amazing experience!', 5);
