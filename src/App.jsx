import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './hooks/useStore.jsx';

// Layout
import BottomNav from './components/layout/BottomNav.jsx';
import Toast from './components/common/Toast.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import Patients from './pages/Patients.jsx';
import PatientForm from './pages/PatientForm.jsx';
import PatientDetail from './pages/PatientDetail.jsx';
import Appointments from './pages/Appointments.jsx';
import AppointmentForm from './pages/AppointmentForm.jsx';
import Today from './pages/Today.jsx';
import ConsultationForm from './pages/ConsultationForm.jsx';
import ConsultationDetail from './pages/ConsultationDetail.jsx';
import ReportForm from './pages/ReportForm.jsx';
import FollowUps from './pages/FollowUps.jsx';
import { DoctorsList, DoctorDetail } from './pages/Doctors.jsx';
import SearchPage from './pages/SearchPage.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';

const App = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients/:id/edit" element={<PatientForm />} />

          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/new" element={<AppointmentForm />} />
          <Route path="/appointments/:id/edit" element={<AppointmentForm />} />

          <Route path="/today" element={<Today />} />

          <Route path="/consultation/new" element={<ConsultationForm />} />
          <Route path="/consultation/:id" element={<ConsultationDetail />} />
          <Route path="/consultation/:id/edit" element={<ConsultationForm />} />

          <Route path="/reports/new" element={<ReportForm />} />
          <Route path="/reports/:id/edit" element={<ReportForm />} />

          <Route path="/followups" element={<FollowUps />} />

          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />

          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;

