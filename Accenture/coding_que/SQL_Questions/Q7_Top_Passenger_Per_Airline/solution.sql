/*
  Q7 - Top-spending passenger on each airline   [MEDIUM-HARD]
  Schema: see schema.svg (this question has its own schema, in this folder)

  For every airline, find the passenger(s) who paid the most in total on that
  airline's flights. Count only bookings with STATUS = 'CONFIRMED' and add up
  FARE_PAID (not the flight PRICE).

  If several passengers tie for the highest total on an airline, show all of
  them. Airlines with no CONFIRMED booking must not appear.

  Your output should contain 3 columns in the below-mentioned order:
      airline_name, passenger_name, total_fare

  Sort by airline_name in ascending order, then by passenger_name in
  ascending order.

  Run:  python check.py Q7   (from the SQL_Questions folder)
*/

-- write your query here

