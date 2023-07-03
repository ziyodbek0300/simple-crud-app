import { IUser } from './types.js';

const db: IUser[] = [];

export default {
  getUsers: () => db,
  getUserById: (id: string) => db.find((user) => user.id === id),
  createUser: (user: IUser) => db.push(user),
  updateUser: (id: string, user: Omit<IUser, 'id'>) => {
    const index = db.findIndex((u) => u.id === id);
    if (index === -1) {
      return false;
    }
    const updatedUser = { ...db[index], ...user };
    db[index] = updatedUser;
    return updatedUser;
  },
  deleteUser(id: string) {
    const index = db.findIndex((u) => u.id === id);
    if (index === -1) {
      return false;
    }
    db.splice(index, 1);
    return true;
  },
};
