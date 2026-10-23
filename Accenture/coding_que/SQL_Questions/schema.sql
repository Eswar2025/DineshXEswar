-- Shared schema + sample data for all SQL questions (SQLite syntax).
-- Do not edit: check.py loads this file before running your query.
-- Many tables are NOT needed by any question - like the real exam, only 1-3 are.

CREATE TABLE customer (
  CUSTOMER_ID DECIMAL(18,0) PRIMARY KEY,
  USERNAME    VARCHAR(40),
  PASSWORD    VARCHAR(40)
);

CREATE TABLE customer_address (
  CUSTOMER_ADDRESS_ID DECIMAL(18,0) PRIMARY KEY,
  CUSTOMER_ID DECIMAL(18,0) REFERENCES customer(CUSTOMER_ID),
  FIRST_NAME  VARCHAR(40),
  LAST_NAME   VARCHAR(40),
  ADDRESS     VARCHAR(200),
  PHONE       DECIMAL(18,0),
  EMAIL       VARCHAR(80)
);

CREATE TABLE customer_order (
  ORDER_ID    DECIMAL(18,0) PRIMARY KEY,
  CUSTOMER_ID DECIMAL(18,0) REFERENCES customer(CUSTOMER_ID),
  USERNAME    VARCHAR(40)
);

CREATE TABLE payment (
  PAYMENT_ID DECIMAL(18,0) PRIMARY KEY,
  ORDER_ID   DECIMAL(18,0) REFERENCES customer_order(ORDER_ID),
  STATUS     VARCHAR(50),
  CCTYPE     VARCHAR(40),
  CCNAME     VARCHAR(200),
  CCDATE     VARCHAR(200)
);

CREATE TABLE order_delivery (
  ORDER_DELIVERY_ID DECIMAL(18,0) PRIMARY KEY,
  ORDER_ID    DECIMAL(18,0) REFERENCES customer_order(ORDER_ID),
  TRACKING_NO DECIMAL(10,0),
  STATUS      VARCHAR(40)
);

CREATE TABLE product (
  PRODUCT_ID DECIMAL(18,0) PRIMARY KEY,
  CODE       VARCHAR(30),
  NAME       VARCHAR(80),
  UNIT_PRICE DECIMAL(10,0)
);

CREATE TABLE category (
  CATEGORY_ID DECIMAL(18,0) PRIMARY KEY,
  CODE        VARCHAR(20),
  NAME        VARCHAR(40)
);

CREATE TABLE product_category (
  PRODUCT_CATEGORY_ID DECIMAL(18,0) PRIMARY KEY,
  PRODUCT_ID  DECIMAL(18,0) REFERENCES product(PRODUCT_ID),
  CATEGORY_ID DECIMAL(18,0) REFERENCES category(CATEGORY_ID)
);

CREATE TABLE order_item (
  ORDER_ITEM_ID     DECIMAL(18,0) PRIMARY KEY,
  ORDER_ID          DECIMAL(18,0) REFERENCES customer_order(ORDER_ID),
  ORDER_DELIVERY_ID DECIMAL(18,0) REFERENCES order_delivery(ORDER_DELIVERY_ID),
  PRODUCT_ID        DECIMAL(18,0) REFERENCES product(PRODUCT_ID),
  QUANTITY          DECIMAL(10,0)
);

-- ---------- extra tables (distractors, left empty) ----------
CREATE TABLE supplier (
  SUPPLIER_ID DECIMAL(18,0) PRIMARY KEY,
  NAME        VARCHAR(80),
  COUNTRY     VARCHAR(40)
);

CREATE TABLE inventory (
  INVENTORY_ID DECIMAL(18,0) PRIMARY KEY,
  PRODUCT_ID   DECIMAL(18,0) REFERENCES product(PRODUCT_ID),
  SUPPLIER_ID  DECIMAL(18,0) REFERENCES supplier(SUPPLIER_ID),
  STOCK        DECIMAL(10,0)
);

CREATE TABLE review (
  REVIEW_ID   DECIMAL(18,0) PRIMARY KEY,
  PRODUCT_ID  DECIMAL(18,0) REFERENCES product(PRODUCT_ID),
  CUSTOMER_ID DECIMAL(18,0) REFERENCES customer(CUSTOMER_ID),
  RATING      DECIMAL(2,0),
  COMMENTS    VARCHAR(400)
);

CREATE TABLE wishlist (
  WISHLIST_ID DECIMAL(18,0) PRIMARY KEY,
  CUSTOMER_ID DECIMAL(18,0) REFERENCES customer(CUSTOMER_ID),
  CREATED_ON  VARCHAR(20)
);

CREATE TABLE coupon (
  COUPON_ID DECIMAL(18,0) PRIMARY KEY,
  CODE      VARCHAR(20),
  DISCOUNT  DECIMAL(5,0)
);

CREATE TABLE order_coupon (
  ORDER_COUPON_ID DECIMAL(18,0) PRIMARY KEY,
  ORDER_ID  DECIMAL(18,0) REFERENCES customer_order(ORDER_ID),
  COUPON_ID DECIMAL(18,0) REFERENCES coupon(COUPON_ID)
);

CREATE TABLE shipping_method (
  SHIPPING_METHOD_ID DECIMAL(18,0) PRIMARY KEY,
  NAME  VARCHAR(40),
  PRICE DECIMAL(10,0)
);

-- ---------- sample data ----------
INSERT INTO customer VALUES
  (1,'alice','pw'),(2,'bob','pw'),(3,'carol','pw'),
  (4,'dave','pw'),(5,'erin','pw'),(6,'frank','pw');

INSERT INTO product VALUES
  (1,'P1','Pen',10),(2,'P2','Notebook',50),(3,'P3','Bag',500),(4,'P4','Eraser',5);
INSERT INTO category VALUES (1,'STA','Stationery'),(2,'ACC','Accessories'),(3,'MSC','Misc');
INSERT INTO product_category VALUES (1,1,1),(2,2,1),(3,3,2),(4,4,1);

-- order 1: alice, PAID    Pen x2 + Notebook x1   = 70
-- order 2: alice, PAID    Bag x1                 = 500   (alice 570)
-- order 3: bob,   PENDING Notebook x4            = 200
-- order 4: bob,   PAID    Pen x3                 = 30    (bob 230)
-- order 5: carol, FAILED  Bag x1                 = 500   (carol 500)
-- order 6: frank, PAID    Notebook x9            = 450   (frank 450)
-- dave and erin have never ordered
INSERT INTO customer_order VALUES
  (1,1,'alice'),(2,1,'alice'),(3,2,'bob'),(4,2,'bob'),(5,3,'carol'),(6,6,'frank');
INSERT INTO payment VALUES
  (1,1,'PAID','VISA','Alice','2027-01'),
  (2,2,'PAID','VISA','Alice','2027-01'),
  (3,3,'PENDING','MC','Bob','2026-12'),
  (4,4,'PAID','MC','Bob','2026-12'),
  (5,5,'FAILED','VISA','Carol','2026-05'),
  (6,6,'PAID','MC','Frank','2028-03');
INSERT INTO order_delivery VALUES
  (1,1,1001,'DELIVERED'),(2,2,1002,'SHIPPED'),(3,3,NULL,'NEW'),
  (4,4,1004,'DELIVERED'),(5,5,NULL,'NEW'),(6,6,1006,'SHIPPED');
INSERT INTO order_item VALUES
  (1,1,1,1,2),(2,1,1,2,1),
  (3,2,2,3,1),
  (4,3,3,2,4),
  (5,4,4,1,3),
  (6,5,5,3,1),
  (7,6,6,2,9);
