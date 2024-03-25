const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'students',
  password: 'Charlie1986!',
  port: 5432,
});

// Function to retrieve all students from the database
const getStudents = async () => {
  const { rows } = await pool.query('SELECT * FROM students');
  return rows;
};

// Function to retrieve a student by ID from the database
const getStudentById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
  return rows[0];
};

// Function to add a new student to the database
const addStudent = async (first_name, last_name, email, phone, age, dob) => {
  const { rows } = await pool.query('INSERT INTO students (first_name, last_name, email, phone, age, dob) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [first_name, last_name, email, phone, age, dob]);
  return rows[0];
};

// Function to update a student in the database
const updateStudent = async (id, first_name, last_name, email, phone, age, dob) => {
  const { rows } = await pool.query('UPDATE students SET first_name=$2, last_name=$3, email=$4, phone=$5, age=$6, dob=$7 WHERE id=$1 RETURNING *', [id, first_name, last_name, email, phone, age, dob]);
  return rows[0];
};

// Function to delete a student from the database
const deleteStudent = async (id) => {
  await pool.query('DELETE FROM students WHERE id=$1', [id]);
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};