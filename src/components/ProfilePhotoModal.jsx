import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useUser } from '../hooks/userContext';
import { auth } from '../firebase.config'; // Asigură-te că importi configurarea Firebase corectă
import { FaUpload } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function ProfilePhotoModal({ isOpen, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const user = useUser();
  const navigate = useNavigate()

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${user.uid}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizează profilul utilizatorului în Firebase Authentication
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
      });

      // Actualizează UI-ul și închide modalul
      onClose();
      navigate(0)
    } catch (error) {
      setError('Failed to upload the image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Add a personal account photo</h2>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="upload-photo"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-photo" className="cursor-pointer flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-gray-500">
                <FaUpload className="w-6 h-6" />
                </span>
            </div>
            <span className="font-semibold">Drop your photo here to instantly upload it</span>
            </label>

          {file && <p className="text-sm mt-2">{file.name}</p>}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 logo-active-button border text-white px-4 py-2 rounded-xl"
          >
            {uploading ? 'Uploading...' : 'Select file'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <p className="text-gray-500 text-sm my-4">
        It should be smaller than 2MB, and it should show your face. That way, your friends and family will know it’s you.
        </p>
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 border border-gray-300 logo-color font-semibold rounded-md w-full"
          >
            Cancel
          </button>
          <br />
          <button className="logo-color font-semibold block mt-2" onClick={() => setFile(null)}>
            Remove current photo
          </button>
      </div>
    </div>
  );
}

export default ProfilePhotoModal;
