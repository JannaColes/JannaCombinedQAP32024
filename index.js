const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./routes/routes');
const dal = require('./dal/dal');
const app = express();
const port = 3000;

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
    const students = await dal.getStudents(); // Assuming you have a function to fetch students from the database
    res.render('index', { students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
