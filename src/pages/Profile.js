import React, { useState, useEffect, useRef } from 'react';
import { auth, storage } from '../services/firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { CgProfile } from "react-icons/cg";
import { TbLogout } from 'react-icons/tb';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdFileUpload } from "react-icons/md";
// const bg = require("../images/background.jpg");
// import bg from "../images/background.jpg";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setNewName(currentUser.displayName || '');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteAvatar = async () => {
        if (!user.photoURL) return;

        try {
            if (user.photoURL.includes(`users/${user.uid}`)) {
                const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
                await deleteObject(storageRef);
            }
            
            await updateProfile(auth.currentUser, {
                photoURL: null
            });
            
            setUser({ ...user, photoURL: null });
            alert('Xóa ảnh đại diện thành công');
        } catch (error) {
            console.error("Error deleting avatar:", error);
            alert('Xóa ảnh đại diện thất bại. Vui lòng thử lại.');
        }
    };

    const handleUploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        try {
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);
            await updateProfile(auth.currentUser, { photoURL });
            setUser({ ...user, photoURL });
            alert('Tải ảnh lên thành công');
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert('Tải ảnh lên thất bại. Vui lòng thử lại.');
        }
    };

    const handleNameChange = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(auth.currentUser, {
                displayName: newName
            });
            setUser({ ...user, displayName: newName });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }
        // Add password change logic here
    };


    return (
        <div className="container mx-auto px-4 py-8">
            {/* Background Banner */}
            <div className="h-72 rounded-md flex flex-col justify-end items-center relative" style={{        
                backgroundImage: `url(${require("../images/background.jpg")})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
                }}>
                {/* Profile Image */}
                <img 
                    src={user?.photoURL || require("../images/profile.jpg")} 
                    alt="Profile" 
                    className="w-36 h-36 object-cover rounded-full absolute bottom-0 transform translate-y-1/2 border-4 border-white"
                />
            </div>

            {/* User Info */}
            <div className="text-center mt-20">
                <h1 className="font-bold text-3xl text-gray-900">{user?.displayName}</h1>
                <p className="text-black text-sm">
                    {`Tham gia QuizStar ngày ${new Date(user?.metadata?.creationTime).toLocaleDateString()}`}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-center gap-4">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center bg-slate-50 rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800"
                >
                    <CgProfile className="mr-1.5"/>
                    Chỉnh sửa thông tin
                </button>
                <button
                    onClick={() => auth.signOut()}
                    className="flex items-center bg-slate-50 rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-red-500"
                >
                    <TbLogout className="mr-1.5"/>
                    Đăng xuất
                </button>
            </div>

            {/* Edit Profile Form */}
            {isEditing && (
                <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Chỉnh sửa thông tin</h2>
                    
                    {/* Avatar Section */}
                    <div className="mb-6">
                        <p className="text-base font-medium text-gray-900 mb-4">Ảnh đại diện</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() => fileInputRef.current.click()}
                                type="button"
                                className="rounded-md bg-blue-500 py-2 px-4 text-center text-sm text-white cursor-pointer hover:bg-blue-600 inline-flex items-center"
                            >
                                <MdFileUpload className="mr-1.5"/>
                                Tải ảnh lên
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUploadAvatar}
                                style={{ display: 'none' }}
                            />
                            <button
                                onClick={handleDeleteAvatar}
                                type="button"
                                className="rounded-md bg-red-500 py-2 px-4 text-center text-sm text-white hover:bg-red-600 inline-flex items-center"
                            >
                                <RiDeleteBin6Line className="mr-1.5"/>
                                Xóa ảnh đại diện
                            </button>
                        </div>
                    </div>

                    {/* Name Change Form */}
                    <form onSubmit={handleNameChange} className="mb-6">
                        <p className="text-base font-medium text-gray-900 mb-2">Họ và tên</p>
                        <div className="relative">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-md pl-3 pr-16 py-4 text-gray-900"
                                placeholder="Họ và tên"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-3.5 rounded bg-slate-800 py-2.5 px-2.5 text-white hover:bg-slate-700"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </form>

                    {/* Password Change Form */}
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <p className="text-lg font-medium text-gray-900">Thay đổi mật khẩu</p>
                        <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-md pl-3 py-4 text-gray-900"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-md pl-3 py-4 text-gray-900"
                                />
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-md pl-3 py-4 text-gray-900"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-slate-700"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profile;
