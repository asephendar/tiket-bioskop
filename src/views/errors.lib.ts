import { useLocation, useNavigate } from 'react-router-dom';

const useLib = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return { location, navigate };
};

export { useLib };
