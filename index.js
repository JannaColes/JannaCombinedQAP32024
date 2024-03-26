const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./routes/routes');
const dal = require('./dal/dal');
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.json());

// Routes
app.use('/api', routes);

// Serve static files (CSS, JS, etc.)
app.use(express.static(__dirname + '/public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.json());
// Route to serve the index page
app.get('/', async (req, res) => {
  try {
    const students = await dal.getStudents();
    res.render('index', { students });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Define your routes here
app.get('/students', async (req, res) => {
  try {
    const students = await dal.getStudents();
    res.json(students);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/students', async (req, res) => {
  try {
    const student = await dal.addStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to serve the index page
app.get('/students/:id', async (req, res) => {
  try {
    const student = await dal.getStudent(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await dal.updateStudent(req.params.id, req.body);
    if (updatedStudent) {
      res.json(updatedStudent);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const result = await dal.deleteStudent(req.params.id);
    if (result) {
      res.json({ message: 'Student deleted' });
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
