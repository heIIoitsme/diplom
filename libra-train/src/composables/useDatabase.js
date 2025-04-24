import { dbService } from '../database/database.service';

export const useDatabase = () => {
  const getUsers = async () => {
    try {
      return await dbService.find('users', {}, { _id: 0, password: 0 });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  };

  const createUser = async (userData) => {
    try {
      return await dbService.insert('users', userData);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  return {
    getUsers,
    createUser
  };
};