import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './Authentication/Login';
import { Register } from './Authentication/Register';
import { LayoutNavBar } from './NavBar';
import { OnSiteTesting } from './OnSiteTesting/OnSiteTesting';
import { Patient } from './Patients/Patient';
import { Patients } from './Patients/Patients';
import { PatientProtectedRoute, ProtectedRoute } from './ProtectedRoute';
import { TestSiteComponent } from './TestSite/TestSite';
import { AuthenticationPresenterProvider } from '../presenter/context/AuthenticationContext';
import { UserType } from '../model/user/UserType';
import { UserPresenterProvider } from '../presenter/context/UserPresenterContext';
import { DataLayerProvider } from '../presenter/context/DataLayerContext';
import { BookingPresenterProvider } from '../presenter/context/BookingPresenterContext';
import { RecordPresenterProvider } from '../presenter/context/RecordPresenterContext';
import { TestSitePresenterProvider } from '../presenter/context/TestSitePresenterContext';
import { useLoadScript } from '@react-google-maps/api';
import { Google } from "../constant/Google";
import { Notifications } from './Notification/Notifications';

function App() {
  /**
   * Load the Google Places API for geocoding
   */
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: Google.key,
  })

  // If not loaded, say we are loading
  if (!isLoaded) return <p>Loading...</p>

  return (
    <DataLayerProvider>
      <UserPresenterProvider>
        <BookingPresenterProvider>
          <TestSitePresenterProvider>
            <RecordPresenterProvider>
              <AuthenticationPresenterProvider>
                <RouterComponent />
              </AuthenticationPresenterProvider>
            </RecordPresenterProvider>
          </TestSitePresenterProvider>
        </BookingPresenterProvider>
      </UserPresenterProvider>
    </DataLayerProvider>
  );
}

/**
 * Configures routes
 * @returns {JSX.Element} configured routes
 */
const RouterComponent: React.FC = () => {
  // Set for employee types
  const employeeTypeSet: Set<UserType> = new Set([UserType.HEALTHCAREWORKER, UserType.RECEPTIONIST])
  const healthcareTypeSet: Set<UserType> = new Set([UserType.HEALTHCAREWORKER])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutNavBar />} >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patients/*" element={
            <Routes>
              <Route path="/:userName" element={
                <PatientProtectedRoute allowedUserTypes={employeeTypeSet}>
                  <Patient />
                </PatientProtectedRoute >
              } />
              <Route path="/" element={
                <ProtectedRoute allowedUserTypes={employeeTypeSet}>
                  <Patients />
                </ProtectedRoute>
              } />
            </Routes>
          } />
          <Route path="/testsites" element={<>
            <TestSiteComponent />
          </>} />
          <Route path="/onsite-testing" element={
            <ProtectedRoute allowedUserTypes={healthcareTypeSet}>
              <OnSiteTesting />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedUserTypes={employeeTypeSet}>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/testsites" replace />} />
          <Route path="*" element={<Navigate to="/testsites" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
