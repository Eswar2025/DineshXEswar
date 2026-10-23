"""Auto-checker for the SQL questions.

Usage (from the SQL_Questions folder):
    python check.py Q1                  # checks Q1_*/solution.sql
    python check.py Q3 other_file.sql   # check a different file against Q3

Your query runs in an in-memory SQLite DB built from schema.sql (the shared one,
or the question folder's own schema.sql if it has one). Its rows and
column names are compared with Q*/reference.sql on the sample data AND on
several random datasets. If the reference has an ORDER BY, row order must match;
otherwise rows are compared ignoring order.
"""
import importlib.util
import random
import re
import sqlite3
import sys
from pathlib import Path

HERE = Path(__file__).parent
FILL_TABLES = ("order_item", "order_delivery", "payment", "customer_order",
               "product_category", "category", "product", "customer")


def strip_comments(sql):
    sql = re.sub(r"/\*.*?\*/", "", sql, flags=re.S)
    sql = re.sub(r"--[^\n]*", "", sql)
    return sql.strip().rstrip(";").strip()


def build_db(qdir, extra=None):
    """A question folder may bring its own schema.sql / random_data.py;
    otherwise the shared ones in this folder are used."""
    db = sqlite3.connect(":memory:")
    schema = qdir / "schema.sql"
    db.executescript((schema if schema.exists() else HERE / "schema.sql").read_text())
    if extra:
        extra(db)
    return db


def random_data(qdir, seed):
    custom = qdir / "random_data.py"
    if custom.exists():
        spec = importlib.util.spec_from_file_location("random_data", custom)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return lambda db: mod.fill(db, random.Random(seed))
    return shared_random_data(seed)


def shared_random_data(seed):
    """Replace the sample data with random rows (customers with no orders,
    products in no category, ties, unpaid orders ... all appear)."""
    def fill(db):
        rnd = random.Random(seed)
        for t in FILL_TABLES:
            db.execute(f"DELETE FROM {t}")
        n_cust, n_prod, n_cat = rnd.randint(3, 8), rnd.randint(3, 7), rnd.randint(2, 5)
        for i in range(1, n_cust + 1):
            db.execute("INSERT INTO customer VALUES (?,?,?)", (i, f"user{i}", "pw"))
        for i in range(1, n_cat + 1):
            db.execute("INSERT INTO category VALUES (?,?,?)", (i, f"C{i}", f"cat{i}"))
        pc = 1
        for i in range(1, n_prod + 1):
            db.execute("INSERT INTO product VALUES (?,?,?,?)",
                       (i, f"P{i}", f"prod{i}", rnd.choice([5, 10, 10, 50, 120, 300, 500])))
            for c in rnd.sample(range(1, n_cat + 1), rnd.randint(0, 2)):
                db.execute("INSERT INTO product_category VALUES (?,?,?)", (pc, i, c))
                pc += 1
        item_id = 1
        for o in range(1, rnd.randint(4, 18) + 1):
            c = rnd.randint(1, n_cust)
            db.execute("INSERT INTO customer_order VALUES (?,?,?)", (o, c, f"user{c}"))
            status = rnd.choice(["PAID", "PAID", "PENDING", "FAILED"])
            db.execute("INSERT INTO payment VALUES (?,?,?,?,?,?)",
                       (o, o, status, "VISA", "x", "2027-01"))
            db.execute("INSERT INTO order_delivery VALUES (?,?,?,?)", (o, o, o, "NEW"))
            for _ in range(rnd.randint(1, 4)):
                db.execute("INSERT INTO order_item VALUES (?,?,?,?,?)",
                           (item_id, o, o, rnd.randint(1, n_prod), rnd.randint(1, 9)))
                item_id += 1
    return fill


def run(db, sql):
    cur = db.execute(sql)
    cols = [d[0].lower() for d in cur.description]
    return cols, [tuple(r) for r in cur.fetchall()]


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    matches = sorted(HERE.glob(sys.argv[1] + "_*"))
    if not matches:
        print("No question folder starting with", sys.argv[1])
        sys.exit(2)
    qdir = matches[0]
    path = Path(sys.argv[2]) if len(sys.argv) > 2 else qdir / "solution.sql"
    mine = strip_comments(path.read_text())
    ref_text = (qdir / "reference.sql").read_text()
    ref = strip_comments(ref_text)
    ordered = "order by" in ref.lower()
    print(f"Checking {qdir.name} ({path.name})\n")
    if not mine:
        print("FAIL: no query found in", path.name)
        sys.exit(1)

    tests = [("sample data", None)] + [(f"random data #{s}", random_data(qdir, s)) for s in range(1, 9)]
    failed = 0
    for name, extra in tests:
        db = build_db(qdir, extra)
        want_cols, want = run(db, ref)
        try:
            got_cols, got = run(db, mine)
        except sqlite3.Error as e:
            print(f"FAIL [{name}]: SQL error: {e}")
            sys.exit(1)
        if got_cols != want_cols:
            print(f"FAIL [{name}]: columns should be {want_cols}, got {got_cols}")
            sys.exit(1)
        same = got == want if ordered else sorted(got, key=repr) == sorted(want, key=repr)
        if same:
            print(f"PASS [{name}]")
        else:
            failed += 1
            print(f"FAIL [{name}]")
            print("   expected:", want)
            print("   got     :", got)
            if name == "sample data":
                break
    print("\nALL TESTS PASSED" if not failed else f"\n{failed} test(s) failed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
