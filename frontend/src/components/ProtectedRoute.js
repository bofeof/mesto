import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { LoggedInContext } from '../contexts/CurrentUserContext';

export default function ProptectedRoute({ component: Component, ...props }) {
  const userLogIn = useContext(LoggedInContext);
  return <Route>{userLogIn ? <Component {...props} /> : <Redirect to="/sign-in" />}</Route>;
}
