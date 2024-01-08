import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ApplicationPage from './components/ApplicationPage';
import PrivateRoute from './components/PrivateRoute';
import SignOut from './components/SignOut';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} /> {/* Add route for SignOut */}
        <Route
          path="/application"
          element={
            <PrivateRoute>
              <ApplicationPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate replace to="/signup" />} />
      </Routes>
    </Router>
  );
};

export default App;
