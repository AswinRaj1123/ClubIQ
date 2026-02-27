"use client";

import React, { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { authAPI } from "@/lib/api";

interface UserData {
  _id: string;
  email: string;
  full_name: string;
  phone: string | null;
  company: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export default function ConsumerProfile() {
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isAddressModalOpen,
    openModal: openAddressModal,
    closeModal: closeAddressModal,
  } = useModal();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [editAddressData, setEditAddressData] = useState({
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = authAPI.getToken();
        console.log("Token from storage:", token ? token.substring(0, 20) + "..." : "NO TOKEN");
        
        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }

        const userData = await authAPI.getCurrentUser(token);
        console.log("User data loaded successfully:", userData);
        
        setUser(userData);
        setEditFormData({
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone || "",
        });
        setEditAddressData({
          street_address: userData.street_address || "",
          city: userData.city || "",
          state: userData.state || "",
          postal_code: userData.postal_code || "",
          country: userData.country || "",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load user data";
        setError(errorMessage);
        console.error("Load user data error:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (user) {
      try {
        setIsSaving(true);
        setSavedMessage(null);
        setError(null);
        
        console.log("[DEBUG] Saving profile with data:", editFormData);
        
        // Call the update profile API
        const updatedUserData = await authAPI.updateProfile({
          full_name: editFormData.full_name,
          email: editFormData.email,
          phone: editFormData.phone,
        });
        
        console.log("[DEBUG] Profile updated:", updatedUserData);
        
        // Update local state
        const updatedUser = {
          ...user,
          full_name: updatedUserData.full_name,
          email: updatedUserData.email,
          phone: updatedUserData.phone,
        };
        setUser(updatedUser);
        setSavedMessage("Profile updated successfully!");
        
        // Hide success message after 3 seconds
        setTimeout(() => setSavedMessage(null), 3000);
        closeModal();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
        console.error("[ERROR] Error updating profile:", errorMessage);
        setError(`Update failed: ${errorMessage}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddressSave = async () => {
    if (user) {
      try {
        setIsSaving(true);
        setSavedMessage(null);
        setError(null);
        
        console.log("[DEBUG] Saving address with data:", editAddressData);
        
        // Call the update profile API with address data
        const updatedUserData = await authAPI.updateProfile({
          street_address: editAddressData.street_address,
          city: editAddressData.city,
          state: editAddressData.state,
          postal_code: editAddressData.postal_code,
          country: editAddressData.country,
        });
        
        console.log("[DEBUG] Address updated:", updatedUserData);
        
        // Update local state
        const updatedUser = {
          ...user,
          street_address: updatedUserData.street_address,
          city: updatedUserData.city,
          state: updatedUserData.state,
          postal_code: updatedUserData.postal_code,
          country: updatedUserData.country,
        };
        setUser(updatedUser);
        setSavedMessage("Address updated successfully!");
        
        // Hide success message after 3 seconds
        setTimeout(() => setSavedMessage(null), 3000);
        closeAddressModal();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update address";
        console.error("[ERROR] Error updating address:", errorMessage);
        setError(`Update failed: ${errorMessage}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
          <p className="font-semibold">Error Loading Profile</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-10">No user data found. Please log in.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {savedMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900/30 dark:border-green-700 dark:text-green-400">
          <p className="font-semibold">{savedMessage}</p>
        </div>
      )}

      {/* Personal Information Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.full_name}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Email address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Account Type
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* Address Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Street Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.street_address || "Not provided"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  City
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.city || "Not provided"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.state || "Not provided"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Postal Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.postal_code || "Not provided"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.country || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openAddressModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Requests
          </p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">
            12
          </p>
        </div>
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-success-600 dark:text-success-400 mt-1">
            8
          </p>
        </div>
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-warning-600 dark:text-warning-400 mt-1">
            2
          </p>
        </div>
      </div>

      {/* Edit Personal Information Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-175 m-4"
      >
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-112.5 overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Full Name</Label>
                  <Input 
                    type="text" 
                    name="full_name"
                    value={editFormData.full_name}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Phone</Label>
                  <Input 
                    type="tel" 
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Account Type</Label>
                  <Input 
                    type="text" 
                    value={user.role} 
                    disabled 
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} disabled={isSaving}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
        className="max-w-175 m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your address details.
            </p>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                {error}
              </div>
            )}
            {savedMessage && (
              <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                {savedMessage}
              </div>
            )}
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    type="text"
                    name="street_address"
                    value={editAddressData.street_address}
                    onChange={handleAddressChange}
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Input 
                    type="text" 
                    name="city"
                    value={editAddressData.city}
                    onChange={handleAddressChange}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <Label>State</Label>
                  <Input 
                    type="text" 
                    name="state"
                    value={editAddressData.state}
                    onChange={handleAddressChange}
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input 
                    type="text" 
                    name="postal_code"
                    value={editAddressData.postal_code}
                    onChange={handleAddressChange}
                    placeholder="Enter postal code"
                  />
                </div>

                <div>
                  <Label>Country</Label>
                  <Input 
                    type="text" 
                    name="country"
                    value={editAddressData.country}
                    onChange={handleAddressChange}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeAddressModal} disabled={isSaving}>
                Close
              </Button>
              <Button size="sm" onClick={handleAddressSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
