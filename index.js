const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./routes/routes');
const dal = require('./dal/dal');
const port = 3000;

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Routes
app.use('/api', routes);

// Serve static files (CSS, JS, etc.)
app.use(express.static(__dirname + '/public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Route to serve the index page
app.get('/', async (req, res) => {
  try {
    console.log('Fetching all students');
    const students = await dal.getStudents();
    console.log('Fetched students:', students);
    res.render('index', { students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send(error.message);
  }
});

// Define your routes here
app.get('/students', async (req, res) => {
  try {
    console.log('Fetching all students');
    const students = await dal.getStudents();
    console.log('Fetched students:', students);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send(error.message);
  }
});

app.post('/students', async (req, res) => {
  try {
    console.log('Adding new student:', req.body);
    const student = await dal.addStudent(req.body);
    console.log('Added student:', student);
    res.status(201).json(student);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send(error.message);
  }
});

// Route to serve the index page
// Route to serve the index page
app.get('/students/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log('Fetching student with ID:', studentId);
    const student = await dal.getStudentById(studentId); // Update function call to getStudentById
    if (student) {
      console.log('Fetched student:', student);
      res.json(student);
    } else {
      console.log('Student not found with ID:', studentId);
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).send(error.message);
  }
});

// Route to update the student data
app.post('/students/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log('Updating student with ID:', studentId);
    console.log('Updated data:', req.body);
    const updatedStudent = await dal.updateStudent(studentId, req.body);
    if (updatedStudent) {
      console.log('Updated student:', updatedStudent);
      res.json(updatedStudent);
    } else {
      console.log('Student not found with ID:', studentId);
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send(error.message);
  }
});
// Route to serve the edit student form
app.get('/students/:id/edit', async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log('Fetching student with ID:', studentId);
    const student = await dal.getStudentById(studentId);
    if (student) {
      console.log('Fetched student:', student);
      // Render the edit form with the student's information
      res.render('edit', { student });
    } else {
      console.log('Student not found with ID:', studentId);
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).send(error.message);
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log('Deleting student with ID:', studentId);
    const result = await dal.deleteStudent(studentId);
    if (result) {
      console.log('Student deleted successfully');
      res.json({ message: 'Student deleted' });
    } else {
      console.log('Student not found with ID:', studentId);
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
