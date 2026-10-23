WITH spend AS (
  SELECT a.AIRLINE_ID,
         a.NAME  AS airline_name,
         p.NAME  AS passenger_name,
         SUM(b.FARE_PAID) AS total_fare
  FROM booking b
  JOIN flight f    ON f.FLIGHT_ID = b.FLIGHT_ID
  JOIN airline a   ON a.AIRLINE_ID = f.AIRLINE_ID
  JOIN passenger p ON p.PASSENGER_ID = b.PASSENGER_ID
  WHERE b.STATUS = 'CONFIRMED'
  GROUP BY a.AIRLINE_ID, a.NAME, p.PASSENGER_ID, p.NAME
),
ranked AS (
  SELECT *, RANK() OVER (PARTITION BY AIRLINE_ID ORDER BY total_fare DESC) AS rnk
  FROM spend
)
SELECT airline_name, passenger_name, total_fare
FROM ranked
WHERE rnk = 1
ORDER BY airline_name ASC, passenger_name ASC;
