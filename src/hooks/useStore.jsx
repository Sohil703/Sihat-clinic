import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getData, saveData, addData, updateData, deleteData, KEYS, getSettings, saveSettings } from '../services/storage.js';
import { seedSampleData } from '../data/sampleData.js';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [settings, setSettings] = useState({ darkMode: false });
  const [toast, setToast] = useState(null);

  const refresh = useCallback(() => {
    setPatients(getData(KEYS.PATIENTS));
    setAppointments(getData(KEYS.APPOINTMENTS));
    setConsultations(getData(KEYS.CONSULTATIONS));
    setReports(getData(KEYS.REPORTS));
    setFollowups(getData(KEYS.FOLLOWUPS));
  }, []);

  useEffect(() => {
    seedSampleData();
    refresh();
    const s = getSettings();
    setSettings(s);
    if (s.darkMode) document.documentElement.setAttribute('data-theme', 'dark');
  }, [refresh]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Patients
  const addPatient = useCallback((data) => {
    const item = addData(KEYS.PATIENTS, data);
    refresh();
    showToast('Patient added successfully');
    return item;
  }, [refresh, showToast]);

  const editPatient = useCallback((id, data) => {
    updateData(KEYS.PATIENTS, id, data);
    refresh();
    showToast('Patient updated');
  }, [refresh, showToast]);

  const removePatient = useCallback((id) => {
    deleteData(KEYS.PATIENTS, id);
    refresh();
    showToast('Patient removed', 'warning');
  }, [refresh, showToast]);

  // Appointments
  const addAppointment = useCallback((data) => {
    const item = addData(KEYS.APPOINTMENTS, data);
    refresh();
    showToast('Appointment scheduled');
    return item;
  }, [refresh, showToast]);

  const editAppointment = useCallback((id, data) => {
    updateData(KEYS.APPOINTMENTS, id, data);
    refresh();
    showToast('Appointment updated');
  }, [refresh, showToast]);

  const updateAppointmentStatus = useCallback((id, status) => {
    updateData(KEYS.APPOINTMENTS, id, { status });
    refresh();
    showToast(status === 'completed' ? 'Marked as completed' : 'Appointment cancelled', status === 'completed' ? 'success' : 'warning');
  }, [refresh, showToast]);

  // Consultations
  const addConsultation = useCallback((data) => {
    const item = addData(KEYS.CONSULTATIONS, data);
    refresh();
    showToast('Consultation saved');
    return item;
  }, [refresh, showToast]);

  const editConsultation = useCallback((id, data) => {
    updateData(KEYS.CONSULTATIONS, id, data);
    refresh();
    showToast('Consultation updated');
  }, [refresh, showToast]);

  // Reports
  const addReport = useCallback((data) => {
    const item = addData(KEYS.REPORTS, data);
    refresh();
    showToast('Report added');
    return item;
  }, [refresh, showToast]);

  const removeReport = useCallback((id) => {
    deleteData(KEYS.REPORTS, id);
    refresh();
    showToast('Report deleted', 'warning');
  }, [refresh, showToast]);

  // Follow-ups
  const addFollowup = useCallback((data) => {
    const item = addData(KEYS.FOLLOWUPS, data);
    refresh();
    showToast('Follow-up scheduled');
    return item;
  }, [refresh, showToast]);

  const removeFollowup = useCallback((id) => {
    deleteData(KEYS.FOLLOWUPS, id);
    refresh();
  }, [refresh, showToast]);

  // Settings
  const toggleDarkMode = useCallback(() => {
    const newSettings = { ...settings, darkMode: !settings.darkMode };
    setSettings(newSettings);
    saveSettings(newSettings);
    if (newSettings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [settings]);

  return (
    <StoreContext.Provider value={{
      patients, appointments, consultations, reports, followups, settings,
      toast, showToast,
      addPatient, editPatient, removePatient,
      addAppointment, editAppointment, updateAppointmentStatus,
      addConsultation, editConsultation,
      addReport, removeReport,
      addFollowup, removeFollowup,
      toggleDarkMode, refresh,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
