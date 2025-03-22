import React, { useState } from 'react';
import { useUser } from '../hooks/userContext';
import ProfilePhotoModal from '../components/ProfilePhotoModal';
import ProfileCompletionBadge from '../components/ProfileCompletaionBadge';
import PasswordConfirmationModal from '../components/PasswordConfirmationModal';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const user = useUser();
  const navigate = useNavigate();
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [actionAfterConfirm, setActionAfterConfirm] = useState(null);

  const openPhotoModal = () => setPhotoModalOpen(true);
  const closePhotoModal = () => setPhotoModalOpen(false);

  const openPasswordModal = (action) => {
    setActionAfterConfirm(action);
    setPasswordModalOpen(true);
  };
  const closePasswordModal = () => setPasswordModalOpen(false);

  const showDetails = () => {
    setDetailsVisible(true);
  };

  const redirectToEdit = () => {
    navigate('/edit-personal-details');
  };

  const handleSuccess = () => {
    if (actionAfterConfirm === 'view') {
      showDetails();
    } else if (actionAfterConfirm === 'edit') {
      redirectToEdit();
    }
    closePasswordModal();
  };

  return (
    <div className="">
      <ProfileCompletionBadge />
      <div className="max-w-4xl mx-auto bg-white dark:text-white dark:bg-gray-800 p-6 rounded-xl">
        {/* Header - Profile Image and Edit Button */}
        <div className="flex items-center space-x-6 mb-6">
          <img
            className="w-20 h-20 rounded-full"
            src={user.photoURL ? user.photoURL : 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'}
            alt="Profile"
          />
          <div>
            <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
            <button
              className="mt-2 dark:bg-green-500 text-green-600 hover:underline rounded-xl p-2 logo-color font-semibold"
              type="button"
              onClick={openPhotoModal}
            >
              Edit account photo
            </button>
          </div>
        </div>

        {/* Modal for changing profile picture */}
        <ProfilePhotoModal isOpen={isPhotoModalOpen} onClose={closePhotoModal} />

      {/* Modal for password confirmation */}
      <PasswordConfirmationModal
          isOpen={isPasswordModalOpen}
          onClose={closePasswordModal}
          onSuccess={handleSuccess}
        />


        {/* Personal Information Section */}
        <div className="flex items-center  justify-between mb-4">
          <h2 className="font-semibold text-2xl">Personal Information</h2>
          <div className="flex space-x-2">
            <button
              className="px-4 py-1 border  dark:bg-green-500 logo-button border-gray-300 rounded-xl"
              type="button"
              onClick={() => {
                setDetailsVisible(false);
                openPasswordModal('view');
              }}
            >
              View details
            </button>
            <button
              className="px-4 py-1 border  dark:bg-green-500 logo-button border-gray-300 rounded-xl"
              type="button"
              onClick={() => openPasswordModal('edit')}
            >
              Edit details
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl border rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-sm text-gray-500">Full legal first and middle names</span>
              <span className="font-medium">{user.firstName || '-'}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Full legal last name(s)</span>
              <span className="font-medium">{user.lastName || '-'}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Date of birth</span>
              <span className="font-medium">{user.dateOfBirth || '-'}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Phone</span>
              <span className="font-medium">{isDetailsVisible ? user.phoneNumber : '*****'}</span>
            </div>
          </div>
        </div>

        {/* Personal Address Section */}
        <h2 className="font-semibold text-2xl mt-6 mb-4">Personal Address</h2>
        <div className="p-6 rounded-xl border rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-sm text-gray-500">Address</span>
              <span className="font-medium">{isDetailsVisible ? user.address : '*****'}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">City</span>
              <span className="font-medium">{isDetailsVisible ? user.city : '*****'}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Postal code</span>
              <span className="font-medium">{isDetailsVisible ? user.postalCode : '*****'}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Country</span>
              <span className="font-medium">{user.country || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
