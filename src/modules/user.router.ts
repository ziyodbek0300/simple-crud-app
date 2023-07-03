import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from './user.service.js';

export default (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (method === 'GET') {
    if (url === '/api/users') {
      const users = getUsers();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(users));
    } else if (url?.startsWith('/api/users/')) {
      const userId = url?.split('/').pop();

      if (userId && uuidValidate(userId)) {
        const user = getUserById(userId);

        if (user) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(user));
        } else {
          res.statusCode = 404;
          res.end('User not found');
        }
      } else {
        res.statusCode = 400;
        res.end('UserId is not valid');
      }
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  } else if (method === 'POST') {
    if (url === '/api/users') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const userData = JSON.parse(body);
          const newUser = createUser(userData);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(newUser));
        } catch (error: any) {
          res.statusCode = 400;
          res.end(error.message);
        }
      });
    }
  } else if (method === 'PUT') {
    if (url?.startsWith('/api/users/')) {
      const userId = url?.split('/').pop();
      if (userId) {
        const user = getUserById(userId);

        if (user) {
          let body = '';

          req.on('data', (chunk) => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const userData = JSON.parse(body);
              const updatedUser = updateUser(userId, userData);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(updatedUser));
            } catch (error: any) {
              res.statusCode = 400;
              res.end(error.message);
            }
          });
        } else {
          res.statusCode = 404;
          res.end('User not found');
        }
      } else {
        res.statusCode = 400;
        res.end('UserId is not valid');
      }
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  } else if (method === 'DELETE') {
    if (url?.startsWith('/api/users/')) {
      const userId = url?.split('/').pop();
      if (userId) {
        const user = getUserById(userId);

        if (user) {
          deleteUser(userId);
          res.statusCode = 204;
          res.end();
        } else {
          res.statusCode = 404;
          res.end('User not found');
        }
      } else {
        res.statusCode = 400;
        res.end('UserId is not valid');
      }
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  }
};
