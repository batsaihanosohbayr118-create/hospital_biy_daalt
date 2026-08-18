const DEFAULT_DOCTOR_PHOTOS = [
  '/doctor-portraits/doctor-01.jpg',
  '/doctor-portraits/doctor-02.jpg',
  '/doctor-portraits/doctor-03.jpg',
  '/doctor-portraits/doctor-04.jpg',
  '/doctor-portraits/doctor-05.jpg',
  '/doctor-portraits/doctor-06.jpg',
  '/doctor-portraits/doctor-07.jpg',
  '/doctor-portraits/doctor-08.jpg'
];

const PHOTO_BY_EMAIL = {
  'oyunaa@gmail.com': '/doctor-portraits/doctor-01.jpg',
  'ireedui@gmail.com': '/doctor-portraits/doctor-02.jpg',
  'tsetsgee@gmail.com': '/doctor-portraits/doctor-03.jpg',
  'tsestgee@gmail.com': '/doctor-portraits/doctor-03.jpg',
  'enhmoron@gmail.com': '/doctor-portraits/doctor-04.jpg',
  'sarnai@gmail.com': '/doctor-portraits/doctor-05.jpg',
  'ariunzaya@gmail.com': '/doctor-portraits/doctor-06.jpg',
  'hangai@gmail.com': '/doctor-portraits/doctor-07.jpg',
  'monhoo@gmail.com': '/doctor-portraits/doctor-08.jpg'
};

const hashDoctor = doctor => {
  const key = `${doctor?.email || ''}${doctor?.first_name || ''}${doctor?.last_name || ''}`;
  return [...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
};

export const getDoctorPhoto = doctor => {
  if (doctor?.profile_image_url) return doctor.profile_image_url;
  const email = String(doctor?.email || '').trim().toLowerCase();
  if (PHOTO_BY_EMAIL[email]) return PHOTO_BY_EMAIL[email];
  return DEFAULT_DOCTOR_PHOTOS[hashDoctor(doctor) % DEFAULT_DOCTOR_PHOTOS.length];
};

export const withDoctorPhoto = doctor => ({
  ...doctor,
  profile_image_url: getDoctorPhoto(doctor)
});
