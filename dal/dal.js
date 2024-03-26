const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'students',
  password: 'Charlie1986!',
  port: 5432,
});

// Function to retrieve all students from the database
const getStudents = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM students')
      .then(result => resolve(result.rows))
      .catch(error => {
        console.error('Error fetching students:', error);
        reject(error);
      });
  });
};

// Function to retrieve a student by ID from the database
const getStudentById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM students WHERE id = $1', [id])
      .then(result => resolve(result.rows[0]))
      .catch(error => {
        console.error(`Error fetching student with ID ${id}:`, error);
        reject(error);
      });
  });
};

// Function to add a student to the database
const addStudent = (first_name, last_name, email, phone, age, dob) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO students (first_name, last_name, email, phone, age, dob) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const values = [first_name, last_name, email, phone, age, dob];
    pool.query(query, values)
      .then(result => resolve(result.rows[0].id))
      .catch(error => {
        console.error('Error adding student:', error);
        reject(error);
      });
  });
};

// Function to update a student in the database
async function updateStudent(id, updatedData) {
  const { first_name, last_name, email, phone, age, dob } = updatedData;
  const query = {
      text: `
          UPDATE students 
          SET 
              first_name = COALESCE($1, first_name), 
              last_name = COALESCE($2, last_name), 
              email = COALESCE($3, email), 
              phone = COALESCE($4, phone), 
              age = COALESCE($5, age), 
              dob = COALESCE($6, dob) 
          WHERE id = $7
          RETURNING *;
      `,
      values: [first_name, last_name, email, phone, age, dob, id]
  };

  const { rows } = await pool.query(query);
  if (rows.length > 0) {
      return rows[0];
  } else {
      return null; // Student not found
  }
}





// Function to delete a student from the database
const deleteStudent = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM students WHERE id=$1', [id])
      .then(() => resolve())
      .catch(error => {
        console.error('Error deleting student:', error);
        reject(error);
      });
  });
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};
