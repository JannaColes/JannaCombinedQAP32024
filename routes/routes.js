const express = require('express');
const router = express.Router();
const dal = require('../dal/dal');

// Route to get all students
router.get('/students', (req, res) => {
  dal.getStudents()
    .then(students => {
      console.log('Retrieved all students:', students);
      res.json(students);
    })
    .catch(error => {
      console.error('Error fetching students:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Route to get a specific student by ID
router.get('/students/:id', (req, res) => {
  const id = req.params.id;
  dal.getStudentById(id)
    .then(student => {
      console.log(`Retrieved student with ID ${id}:`, student);
      if (student) {
        res.json(student);
      } else {
        res.status(404).send('Student not found');
      }
    })
    .catch(error => {
      console.error(`Error fetching student with ID ${id}:`, error);
      res.status(500).send('Internal Server Error');
    });
});


// Route to add a new student
router.post('/students', (req, res) => {
  const { first_name, last_name, email, phone, age, dob } = req.body;
  dal.addStudent(first_name, last_name, email, phone, age, dob)
    .then(id => {
      console.log('Added new student with ID:', id);
      res.status(201).redirect('/');
    })
    .catch(error => {
      if (error.code === '23505') {
        res.status(400).send('Student with the same ID already exists');
      } else {
        console.error('Error adding student:', error);
        res.status(500).send('Internal Server Error');
      }
    });
});

// Route to update a student
router.put('/students/:id', (req, res) => {
  const id = req.params.id;
  const studentData = req.body;
  
  // Check if studentData is not empty
  if (Object.keys(studentData).length === 0) {
    return res.status(400).send('No fields to update were provided');
  }

  dal.updateStudent(id, studentData)
    .then(updatedStudent => {
      console.log(`Updated student with ID ${id}:`, updatedStudent);
      if (updatedStudent) {
        res.json(updatedStudent);
      } else {
        res.status(404).send('Student not found');
      }
    })
    .catch(error => {
      console.error('Error updating student:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Route to delete a student
router.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  dal.deleteStudent(id)
    .then(() => {
      console.log('Deleted student with ID:', id);
      res.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting student:', error);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;
