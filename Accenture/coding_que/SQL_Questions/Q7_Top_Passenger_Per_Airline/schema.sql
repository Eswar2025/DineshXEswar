-- Airline booking schema for Q7 (SQLite syntax). Do not edit.

CREATE TABLE airline (
  AIRLINE_ID DECIMAL(18,0) PRIMARY KEY,
  NAME       VARCHAR(60),
  COUNTRY    VARCHAR(40)
);

CREATE TABLE aircraft (
  AIRCRAFT_ID DECIMAL(18,0) PRIMARY KEY,
  MODEL       VARCHAR(40),
  CAPACITY    DECIMAL(5,0)
);

CREATE TABLE airport (
  AIRPORT_ID DECIMAL(18,0) PRIMARY KEY,
  CODE       VARCHAR(5),
  CITY       VARCHAR(60),
  COUNTRY    VARCHAR(40)
);

CREATE TABLE flight (
  FLIGHT_ID   DECIMAL(18,0) PRIMARY KEY,
  AIRLINE_ID  DECIMAL(18,0) REFERENCES airline(AIRLINE_ID),
  AIRCRAFT_ID DECIMAL(18,0) REFERENCES aircraft(AIRCRAFT_ID),
  ORIGIN_ID   DECIMAL(18,0) REFERENCES airport(AIRPORT_ID),
  DEST_ID     DECIMAL(18,0) REFERENCES airport(AIRPORT_ID),
  DEPART_DATE VARCHAR(10),
  PRICE       DECIMAL(10,0)
);

CREATE TABLE passenger (
  PASSENGER_ID DECIMAL(18,0) PRIMARY KEY,
  NAME         VARCHAR(60),
  EMAIL        VARCHAR(80),
  COUNTRY      VARCHAR(40)
);

CREATE TABLE booking (
  BOOKING_ID   DECIMAL(18,0) PRIMARY KEY,
  PASSENGER_ID DECIMAL(18,0) REFERENCES passenger(PASSENGER_ID),
  FLIGHT_ID    DECIMAL(18,0) REFERENCES flight(FLIGHT_ID),
  STATUS       VARCHAR(20),
  FARE_PAID    DECIMAL(10,0)
);

CREATE TABLE baggage (
  BAGGAGE_ID DECIMAL(18,0) PRIMARY KEY,
  BOOKING_ID DECIMAL(18,0) REFERENCES booking(BOOKING_ID),
  WEIGHT_KG  DECIMAL(5,0)
);

CREATE TABLE seat (
  SEAT_ID   DECIMAL(18,0) PRIMARY KEY,
  FLIGHT_ID DECIMAL(18,0) REFERENCES flight(FLIGHT_ID),
  SEAT_NO   VARCHAR(5),
  CLASS     VARCHAR(20)
);

CREATE TABLE crew (
  CREW_ID DECIMAL(18,0) PRIMARY KEY,
  NAME    VARCHAR(60),
  ROLE    VARCHAR(30)
);

CREATE TABLE flight_crew (
  FLIGHT_CREW_ID DECIMAL(18,0) PRIMARY KEY,
  FLIGHT_ID DECIMAL(18,0) REFERENCES flight(FLIGHT_ID),
  CREW_ID   DECIMAL(18,0) REFERENCES crew(CREW_ID)
);

CREATE TABLE loyalty_card (
  CARD_ID      DECIMAL(18,0) PRIMARY KEY,
  PASSENGER_ID DECIMAL(18,0) REFERENCES passenger(PASSENGER_ID),
  POINTS       DECIMAL(10,0)
);

-- ---------- sample data ----------
INSERT INTO airline VALUES (1,'SkyJet','India'),(2,'AirNova','India'),(3,'Cloudair','UAE');
INSERT INTO aircraft VALUES (1,'A320',180);
INSERT INTO airport VALUES (1,'DEL','Delhi','India'),(2,'BOM','Mumbai','India'),
                           (3,'BLR','Bengaluru','India'),(4,'HYD','Hyderabad','India');
INSERT INTO flight VALUES
  (1,1,1,1,2,'2026-11-01',100),   -- SkyJet  DEL-BOM
  (2,1,1,2,3,'2026-11-02',150),   -- SkyJet  BOM-BLR
  (3,2,1,1,4,'2026-11-03',200),   -- AirNova DEL-HYD
  (4,2,1,4,3,'2026-11-04',120),   -- AirNova HYD-BLR
  (5,3,1,1,3,'2026-11-05',90);    -- Cloudair DEL-BLR
INSERT INTO passenger VALUES
  (1,'Asha','asha@x.com','India'),(2,'Ravi','ravi@x.com','India'),
  (3,'Meena','meena@x.com','India'),(4,'Kiran','kiran@x.com','India');

-- SkyJet : Asha 100+150=250 (top), Ravi 100 (his 150 booking is CANCELLED)
-- AirNova: Meena 200+120=320 and Kiran 200+120=320  -> tie, both shown
-- Cloudair: only a PENDING booking -> airline does not appear
INSERT INTO booking VALUES
  (1,1,1,'CONFIRMED',100),(2,1,2,'CONFIRMED',150),
  (3,2,1,'CONFIRMED',100),(4,2,2,'CANCELLED',150),
  (5,3,3,'CONFIRMED',200),(6,3,4,'CONFIRMED',120),
  (7,4,3,'CONFIRMED',200),(8,4,4,'CONFIRMED',120),
  (9,1,5,'PENDING',90);
