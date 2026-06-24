// LocalStorage service for Sihat Clinic
const KEYS = {
  PATIENTS: 'sihat_patients',
  APPOINTMENTS: 'sihat_appointments',
  CONSULTATIONS: 'sihat_consultations',
  REPORTS: 'sihat_reports',
  FOLLOWUPS: 'sihat_followups',
  SETTINGS: 'sihat_settings',
};

export const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
};

export const updateData = (key, id, updates) => {
  const items = getData(key);
  const updated = items.map(item => item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item);
  saveData(key, updated);
  return updated.find(i => i.id === id);
};

export const deleteData = (key, id) => {
  const items = getData(key);
  const filtered = items.filter(item => item.id !== id);
  saveData(key, filtered);
  return filtered;
};

export const addData = (key, item) => {
  const items = getData(key);
  const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
  saveData(key, [...items, newItem]);
  return newItem;
};

export const getSettings = () => {
  try {
    const s = localStorage.getItem(KEYS.SETTINGS);
    return s ? JSON.parse(s) : { darkMode: false };
  } catch {
    return { darkMode: false };
  }
};

export const saveSettings = (settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const generatePatientId = () => {
  const patients = getData(KEYS.PATIENTS);
  const num = (patients.length + 1).toString().padStart(4, '0');
  return `SC-${num}`;
};

export const exportData = () => {
  const data = {
    exportDate: new Date().toISOString(),
    clinic: 'Sihat Clinic',
    patients: getData(KEYS.PATIENTS),
    appointments: getData(KEYS.APPOINTMENTS),
    consultations: getData(KEYS.CONSULTATIONS),
    reports: getData(KEYS.REPORTS),
    followups: getData(KEYS.FOLLOWUPS),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sihat-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    if (data.patients) saveData(KEYS.PATIENTS, data.patients);
    if (data.appointments) saveData(KEYS.APPOINTMENTS, data.appointments);
    if (data.consultations) saveData(KEYS.CONSULTATIONS, data.consultations);
    if (data.reports) saveData(KEYS.REPORTS, data.reports);
    if (data.followups) saveData(KEYS.FOLLOWUPS, data.followups);
    return true;
  } catch {
    return false;
  }
};

export { KEYS };
