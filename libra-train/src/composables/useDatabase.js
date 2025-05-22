import { dbService } from '../backend/database/database.service';

export const useDatabase = () => {
  const getUser = async () => {
    try {
      return await dbService.find('user', {}, { _id: 0, password: 0 });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return [];
    }
  };

  const createUser = async (userData) => {
    try {
      return await dbService.insert('user', userData);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  return {
    getUser,
    createUser
  };
};