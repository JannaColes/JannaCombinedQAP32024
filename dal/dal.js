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

async function addStudent(first_name, last_name, email, phone, age, dob) {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO students (first_name, last_name, email, phone, age, dob) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const values = [first_name, last_name, email, phone, age, dob];
    const result = await client.query(query, values);
    return result.rows[0].id; // Return the ID of the inserted student
  } catch (error) {
    throw error; // Rethrow any other errors
  } finally {
    client.release();
  }
};


// Function to update a student in the database
const updateStudent = async (id, studentData) => {
  console.log('updateStudent function called');
  console.log(`ID: ${id}`);
  console.log('Student data:', studentData);

  const { first_name, last_name, email, phone, age, dob } = studentData;
  const query = `
    UPDATE students 
    SET first_name = $1, 
        last_name = $2, 
        email = $3, 
        phone = $4, 
        age = $5, 
        dob = $6 
    WHERE id = $7
    RETURNING *;
  `;
  const values = [first_name, last_name, email, phone, age, dob, id];

  try {
    const result = await pool.query(query, values);
    console.log('Update result:', result);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error updating student:', err);
    throw err;
  }
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