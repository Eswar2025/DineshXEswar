-- Company / HR schema for Q6 (SQLite syntax). Do not edit.

CREATE TABLE department (
  DEPT_ID  DECIMAL(18,0) PRIMARY KEY,
  NAME     VARCHAR(60),
  LOCATION VARCHAR(60)
);

CREATE TABLE job (
  JOB_ID     DECIMAL(18,0) PRIMARY KEY,
  TITLE      VARCHAR(60),
  MIN_SALARY DECIMAL(10,0),
  MAX_SALARY DECIMAL(10,0)
);

CREATE TABLE employee (
  EMP_ID     DECIMAL(18,0) PRIMARY KEY,
  FIRST_NAME VARCHAR(40),
  LAST_NAME  VARCHAR(40),
  MANAGER_ID DECIMAL(18,0) REFERENCES employee(EMP_ID),
  DEPT_ID    DECIMAL(18,0) REFERENCES department(DEPT_ID),
  JOB_ID     DECIMAL(18,0) REFERENCES job(JOB_ID),
  SALARY     DECIMAL(10,0),
  HIRE_DATE  VARCHAR(10)
);

CREATE TABLE job_history (
  HISTORY_ID DECIMAL(18,0) PRIMARY KEY,
  EMP_ID     DECIMAL(18,0) REFERENCES employee(EMP_ID),
  JOB_ID     DECIMAL(18,0) REFERENCES job(JOB_ID),
  START_DATE VARCHAR(10),
  END_DATE   VARCHAR(10)
);

CREATE TABLE project (
  PROJECT_ID DECIMAL(18,0) PRIMARY KEY,
  NAME       VARCHAR(80),
  DEPT_ID    DECIMAL(18,0) REFERENCES department(DEPT_ID),
  BUDGET     DECIMAL(12,0)
);

CREATE TABLE assignment (
  ASSIGNMENT_ID DECIMAL(18,0) PRIMARY KEY,
  EMP_ID        DECIMAL(18,0) REFERENCES employee(EMP_ID),
  PROJECT_ID    DECIMAL(18,0) REFERENCES project(PROJECT_ID),
  HOURS         DECIMAL(6,0)
);

CREATE TABLE leave_request (
  LEAVE_ID   DECIMAL(18,0) PRIMARY KEY,
  EMP_ID     DECIMAL(18,0) REFERENCES employee(EMP_ID),
  START_DATE VARCHAR(10),
  END_DATE   VARCHAR(10),
  STATUS     VARCHAR(20)
);

CREATE TABLE training (
  TRAINING_ID DECIMAL(18,0) PRIMARY KEY,
  TITLE       VARCHAR(80),
  COST        DECIMAL(10,0)
);

CREATE TABLE employee_training (
  ET_ID       DECIMAL(18,0) PRIMARY KEY,
  EMP_ID      DECIMAL(18,0) REFERENCES employee(EMP_ID),
  TRAINING_ID DECIMAL(18,0) REFERENCES training(TRAINING_ID),
  SCORE       DECIMAL(5,0)
);

CREATE TABLE bonus (
  BONUS_ID DECIMAL(18,0) PRIMARY KEY,
  EMP_ID   DECIMAL(18,0) REFERENCES employee(EMP_ID),
  AMOUNT   DECIMAL(10,0),
  YEAR     DECIMAL(4,0)
);

-- ---------- sample data ----------
INSERT INTO department VALUES (1,'Engineering','Pune'),(2,'Sales','Mumbai');
INSERT INTO job VALUES (1,'Director',5000,20000),(2,'Manager',3000,12000),(3,'Engineer',2000,9000);

-- Ava is the top boss (no manager). Salaries chosen so that:
--   Cara (7000) > her manager Ben (6000)     -> diff 1000
--   Eli  (9500) > his manager Ava (9000)     -> diff 500
--   Fay  (6500) < her manager Cara (7000)
--   Dan  (4000) < Ben (6000)
--   Gus  (3000) < Eli (9500)
INSERT INTO employee VALUES
  (1,'Ava','Stone',NULL,1,1,9000,'2015-01-10'),
  (2,'Ben','Hall',1,1,2,6000,'2017-03-01'),
  (3,'Cara','Lee',2,1,3,7000,'2019-06-15'),
  (4,'Dan','Roy',2,1,3,4000,'2020-02-20'),
  (5,'Eli','Fox',1,2,2,9500,'2018-09-09'),
  (6,'Fay','Kim',3,1,3,6500,'2021-11-30'),
  (7,'Gus','Ray',5,2,3,3000,'2022-07-04');
