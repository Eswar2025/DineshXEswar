"""Random datasets for Q6: manager trees with ties and a top boss without manager."""


def fill(db, rnd):
    for t in ("bonus", "employee_training", "training", "leave_request", "assignment",
              "project", "job_history", "employee", "job", "department"):
        db.execute(f"DELETE FROM {t}")
    db.execute("INSERT INTO department VALUES (1,'D1','X')")
    db.execute("INSERT INTO job VALUES (1,'J1',0,99999)")
    n = rnd.randint(4, 12)
    for i in range(1, n + 1):
        manager = None if i == 1 else rnd.randint(1, i - 1)
        salary = rnd.choice([2000, 3000, 3000, 4000, 5000, 5000, 6000, 8000])
        db.execute("INSERT INTO employee VALUES (?,?,?,?,?,?,?,?)",
                   (i, f"F{i}", f"L{i}", manager, 1, 1, salary, "2020-01-01"))
