const express = require('express');
const router = express.Router();
const dal = require('../dal/dal');

// Route to get all students
router.get('/students', async (req, res) => {
  try {
    const students = await dal.getStudents();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to get a specific student by ID
router.get('/students/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const student = await dal.getStudentById(id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to add a new student
router.post('/students', async (req, res) => {
  const { first_name, last_name, email, phone, age, dob } = req.body;
  try {
    const newStudent = await dal.addStudent(first_name, last_name, email, phone, age, dob);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to update a student
router.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, email, phone, age, dob } = req.body;
  try {
    const updatedStudent = await dal.updateStudent(id, first_name, last_name, email, phone, age, dob);
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('Internal Server Error');
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
