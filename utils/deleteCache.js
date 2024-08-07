import axios from "axios";
import { Alert } from "react-native";

export const deleteCache = async () => {
    try {
      const response = await axios.delete('https://connect-backend-sable.vercel.app/api/delcache');
      if (response.status !== 200) {
        // Alert.alert('Error', 'Failed to  cache');
      }
    } catch (error) {
      console.error('Error deleting cache:', error);
      Alert.alert('Error', 'An error occurred while deleting cache');
    }
};