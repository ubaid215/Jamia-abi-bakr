import { useSelector } from 'react-redux';
import Settings from './components/Settings';

const AdminSetting = () => {
  const user = useSelector(state => state.auth.user);

  if (user.role !== 'admin') {
    return <p>Access denied. You must be an admin to view this page.</p>;
  }

  return <Settings />;
};

export default AdminSetting;