import db from '../db.js';
import { IUser } from '../types.js';
import { User } from './user.model.js';

export const getUsers = () => {
  return db.getUsers();
};

export const getUserById = (id: string) => {
  return db.getUserById(id);
};

export const createUser = (userData: Omit<IUser, 'id'>) => {
  const user: IUser = new User(userData.username, userData.age, userData.hobbies);
  db.createUser(user);
  return user;
};
export const updateUser = (id: string, userData: Omit<IUser, 'id'>) => {
  return db.updateUser(id, userData);
};

export const deleteUser = (id: string) => {
  return db.deleteUser(id);
};
