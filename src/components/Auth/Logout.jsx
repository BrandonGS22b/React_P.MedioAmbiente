// LogoutButton.js
import axiosInstance from '../../service/axiosInstance';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      console.log('Logout successful');
    } catch (err) {
      console.error('Error logging out', err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
