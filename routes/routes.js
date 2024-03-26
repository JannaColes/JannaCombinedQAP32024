const express = require('express');
const router = express.Router();
const dal = require('../dal/dal');

// Route to get all students
router.get('/students', async (req, res) => {
  const students = await dal.getStudents();
  res.json(students);
});

// Route to get a specific student by ID
router.get('/students/:id', async (req, res) => {
  const id = req.params.id;
  const student = await dal.getStudentById(id); // Use getStudentById, not getStudent
  if (student) {
    res.json(student);
  } else {
    res.status(404).send('Student not found');
  }
});
// Route to add a new student
router.post('/students', async (req, res) => {
  const { first_name, last_name, email, phone, age, dob } = req.body;
  try {
    await dal.addStudent(first_name, last_name, email, phone, age, dob);
    res.status(201).redirect('/');
  } catch (error) {
    if (error.code === '23505') { // Check if the error is due to duplicate key violation
      res.status(400).send('Student with the same ID already exists');
    } else {
      console.error('Error adding student:', error);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Route to update a student
router.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const studentData = req.body;
  
  // Check if studentData is not empty
  if (Object.keys(studentData).length === 0) {
    return res.status(400).send('No fields to update were provided');
  }

  try {
    const updatedStudent = await dal.updateStudent(id, studentData);
    if (updatedStudent) {
      res.json(updatedStudent);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    res.status(500).send('Error updating student');
  }
});

// Route to delete a student
router.delete('/students/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await dal.deleteStudent(id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
