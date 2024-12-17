import axios from "axios";

export const login = async (email, password) => 
{
  
  try 
  {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { 
      email, 
      password 
    });
    
    // Lưu token vào header mặc định của axios
    if (response.data.access_token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }
    
    return response.data;

  } catch (error) {
    throw error.response?.data || error;
  }

};

export const register = async (name, email, password, password_confirmation) => 
{
  try 
  {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, 
    {
      name,
      email, 
      password,
      password_confirmation
    });
    
    return response.data;

  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = async () => 
{
  try 
  {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`);
    // Xóa token khỏi header
    delete axios.defaults.headers.common['Authorization'];

    return response.data;

  } catch (error) {
    throw error.response?.data || error;
  }
};