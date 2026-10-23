"""Random datasets for Q7: cancelled/pending bookings, airlines without bookings, ties."""


def fill(db, rnd):
    for t in ("loyalty_card", "flight_crew", "crew", "seat", "baggage", "booking",
              "passenger", "flight", "airport", "aircraft", "airline"):
        db.execute(f"DELETE FROM {t}")
    db.execute("INSERT INTO aircraft VALUES (1,'A320',180)")
    for i in range(1, 5):
        db.execute("INSERT INTO airport VALUES (?,?,?,?)", (i, f"A{i}", f"city{i}", "X"))
    n_air = rnd.randint(2, 4)
    for i in range(1, n_air + 1):
        db.execute("INSERT INTO airline VALUES (?,?,?)", (i, f"air{i}", "X"))
    n_fl = rnd.randint(3, 8)
    for f in range(1, n_fl + 1):
        o, d = rnd.sample(range(1, 5), 2)
        db.execute("INSERT INTO flight VALUES (?,?,?,?,?,?,?)",
                   (f, rnd.randint(1, n_air), 1, o, d, "2026-11-01", 100))
    n_pax = rnd.randint(3, 6)
    for p in range(1, n_pax + 1):
        db.execute("INSERT INTO passenger VALUES (?,?,?,?)", (p, f"pax{p}", "e", "X"))
    for b in range(1, rnd.randint(6, 20) + 1):
        db.execute("INSERT INTO booking VALUES (?,?,?,?,?)",
                   (b, rnd.randint(1, n_pax), rnd.randint(1, n_fl),
                    rnd.choice(["CONFIRMED", "CONFIRMED", "CANCELLED", "PENDING"]),
                    rnd.choice([50, 100, 100, 150, 200])))
