import React, { useState } from 'react';
import { useUser } from '../hooks/userContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.config'; // Importă configurarea Firestore din fișierul tău
import { doc, updateDoc } from 'firebase/firestore'; // Importă funcțiile pentru documente
import { toast } from 'react-toastify';
function EditPersonalDetails() {
  const user = useUser();
  const navigate = useNavigate();

  // State pentru detaliile personale
// Inițializarea stării `formData`
const [formData, setFormData] = useState({
  country: user.country || '',
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  dateOfBirth: {
    day: user.dateOfBirth ? user.dateOfBirth.split('.')[0] : '',
    month: user.dateOfBirth ? user.dateOfBirth.split('.')[1] : '',
    year: user.dateOfBirth ? user.dateOfBirth.split('.')[2] : '',
  },
  phoneNumber: user.phoneNumber || '',
  address: user.address || '',
  city: user.city || '',
  postalCode: user.postalCode || '',
});

const handleChange = (e) => {
  const { name, value } = e.target;

  if (['day', 'month', 'year'].includes(name)) {
    setFormData({
      ...formData,
      dateOfBirth: {
        ...formData.dateOfBirth,
        [name]: value,
      },
    });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};


  const updateUserDetails = async (updatedData) => {
    try {
      // Obține referința la documentul utilizatorului în Firestore
      const userDocRef = doc(db, 'users', user.uid);
  
      // Actualizează documentul cu noile date
      await updateDoc(userDocRef, updatedData);
  
      console.log('User details updated successfully');
      // Poți afișa un mesaj de succes sau poți folosi un toast pentru notificare
    } catch (error) {
      console.error('Error updating user details: ', error);
      // Poți afișa un mesaj de eroare sau un toast pentru notificare
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Formatează data de naștere ca "dd.MM.yyyy"
      const formattedDateOfBirth = `${formData.dateOfBirth.day.padStart(2, '0')}.${formData.dateOfBirth.month.padStart(2, '0')}.${formData.dateOfBirth.year}`;
  
      // Preia datele necesare pentru actualizare din starea `formData`
      const updatedData = {
        country: formData.country,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formattedDateOfBirth,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      };
  
      // Apelează funcția pentru actualizarea datelor în Firestore
      await updateUserDetails(updatedData);

      navigate('/settings/profile')
      toast('User details updated')
      navigate(0)
  
      // Navighează înapoi la pagina de profil după salvare
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };
  
  
  return (
    <div className="p-6 sm:ml-64 ">
      <div className="max-w-lg mx-auto bg-white  dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Tell us about yourself</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country of residence */}
          <div>
            <label className="block dark:text-gray-400 text-sm font-medium text-gray-700">Country of residence</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1  dark:bg-gray-800 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select country</option>
              <option value="Romania">Romania</option>
              <option value="United States">United States</option>
              {/* Adaugă alte țări după nevoie */}
            </select>
          </div>

          {/* Personal Details */}
          <h3 className="font-semibold text-lg">Personal details</h3>
          <div className="grid grid-cols-1  dark:bg-gray-800 dark:text-gray-400 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm dark:text-gray-400 text-gray-700">Full legal first and middle name(s)</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`${
                  user.firstName ? 'input-disabled' : ''
                } dark:bg-gray-800 dark:text-gray-400 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                disabled={user.firstName} />
            </div>
            <div>
              <label className="block  dark:bg-gray-800 dark:text-gray-400 text-sm text-gray-700">Full legal last name(s)</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`${
                  user.lastName ? 'input-disabled' : ''
                } dark:bg-gray-800 dark:text-gray-400 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                disabled={user.lastName} 
              />
            </div>
          </div>

          {/* Date of birth */}
          <div>
            <label className="block text-sm  dark:bg-gray-800 dark:text-gray-400 font-medium text-gray-700">Date of birth</label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="month"
                placeholder="Month"
                value={formData.dateOfBirth.month || ''}
                onChange={handleChange}
                className="mt-1 block  dark:bg-gray-800 dark:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="number"
                name="day"
                placeholder="Day"
                value={formData.dateOfBirth.day || ''}
                onChange={handleChange}
                className="mt-1 block w-full  dark:bg-gray-800 dark:text-gray-400 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={formData.dateOfBirth.year || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2  dark:bg-gray-800 dark:text-gray-400 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-sm font-medium  dark:text-gray-400 text-gray-700">Phone number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full dark:bg-gray-800 dark:text-gray-400 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              className="mt-2 text-green-600 hover:underline"
            >
              Change phone number
            </button>
          </div>

          {/* Address */}
          <h3 className="font-semibold text-lg">Address</h3>
          <div>
            <label className="block text-sm  dark:text-gray-400 text-gray-700">Home address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block  dark:bg-gray-800 dark:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700  dark:text-gray-400">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block   dark:bg-gray-800 dark:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm   dark:bg-gray-800 dark:text-gray-400 text-gray-700">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="mt-1 block  dark:bg-gray-800 dark:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPersonalDetails;
