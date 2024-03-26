const request = require('supertest');
const app = require('./index'); 

describe('Martha’s Good Eats', () => {
  it('customer can see a web page listing all the students from the database', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('business partner can fetch all the students from the database from a REST API', async () => {
    const res = await request(app).get('/api/students');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('staff member can see a web page that will allow them to add a new student to the database', async () => {
    const newStudent = { first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', phone: '1234567890', age: 20, dob: '2001-01-01' };
    let res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toEqual(201);
    res = await request(app).get('/students');
    expect(res.body).toContainEqual(expect.objectContaining(newStudent));
  });

  it('staff member can update a student in the database', async () => {
    const updatedStudent = { first_name: 'Jane' };
    let res = await request(app).put('/students/1').send(updatedStudent);
    expect(res.statusCode).toEqual(200);
    res = await request(app).get('/students/1');
    expect(res.body).toMatchObject(updatedStudent);
  });

  it('staff member can delete a student from the database', async () => {
    let res = await request(app).delete('/students/1');
    expect(res.statusCode).toEqual(200);
    res = await request(app).get('/students/1');
    expect(res.statusCode).toEqual(404);
  });
});