import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { ShoppingCartContext } from '../../Context';

const ProtectedRoute = ({ children }) => {
  const { isUserAuthenticated, isLoading } = useContext(ShoppingCartContext);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  if (!isUserAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;