import supertest from 'supertest';
import { config } from 'dotenv';
import { IUser } from '../types.js';

config();

const { HOST, PORT } = process.env;
const request = supertest(`${HOST}:${PORT}`);

const user: Omit<IUser, 'id'> = {
  username: 'John Doe',
  age: 32,
  hobbies: ['football', 'cooking'],
};

const updatedUser: Omit<IUser, 'id'> = {
  username: 'Updated User',
  age: 40,
  hobbies: ['reading', 'gardening'],
};

describe('Requests', () => {
  test('Get all records with a GET api/users request (an empty array is expected)', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('A new object is created by a POST api/users request (a response containing newly created record is expected)', async () => {
    const response = await request.post('/api/users').send(user);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.username).toBe(user.username);
    expect(response.body.age).toBe(user.age);
    expect(response.body.hobbies).toEqual(user.hobbies);
  });

  test('With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
    const responseCreate = await request.post('/api/users').send(user);
    const createdUser = responseCreate.body;

    expect(responseCreate.status).toBe(201);
    expect(responseCreate.body.id).toBeDefined();

    const userId = responseCreate.body.id;

    const responseGet = await request.get(`/api/users/${userId}`);
    expect(responseGet.status).toBe(200);
    expect(responseGet.body).toEqual(createdUser);
  });

  test('With a PUT api/users/{userId} request, we try to update the created record (a response containing an updated object with the same id is expected)', async () => {
    const responseCreate = await request.post('/api/users').send(user);
    expect(responseCreate.status).toBe(201);
    expect(responseCreate.body.id).toBeDefined();

    const userId = responseCreate.body.id;

    const responseUpdate = await request.put(`/api/users/${userId}`).send(updatedUser);
    expect(responseUpdate.status).toBe(200);
    expect(responseUpdate.body.id).toBe(userId);
    expect(responseUpdate.body.username).toBe(updatedUser.username);
    expect(responseUpdate.body.age).toBe(updatedUser.age);
    expect(responseUpdate.body.hobbies).toEqual(updatedUser.hobbies);
  });

  test('With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)', async () => {
    const responseCreate = await request.post('/api/users').send(user);
    expect(responseCreate.status).toBe(201);
    expect(responseCreate.body.id).toBeDefined();

    const userId = responseCreate.body.id;

    const responseDelete = await request.delete(`/api/users/${userId}`);
    expect(responseDelete.status).toBe(204);

    const responseGet = await request.get(`/api/users/${userId}`);
    expect(responseGet.status).toBe(404);
  });
});
