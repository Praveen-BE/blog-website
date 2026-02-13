import { logoutAPI } from '@/lib/authApi';
import { UserContext } from '../context/UserContext';
import Link from 'next/link';
import React, { useContext } from 'react'

const Profile = () => {
  return (
    <div
        id="profile-dropdown-menu"
        className="bg-white z-20 shadow-lg py-6 px-6 rounded-sm sm:min-w-[320px] max-sm:min-w-[250px] absolute right-0 top-10"
    >
        <h6 className="font-semibold text-[15px]">Welcome</h6>
        <p className="text-sm text-gray-500 mt-1">
        To access account and Create Your blog post and edit.
        </p>
        <Link href={`/auth`}>
          <button className="bg-transparent border border-gray-300 hover:border-black rounded-sm px-4 py-2 mt-4 text-sm text-slate-900 font-medium cursor-pointer">
            LOGIN / SIGNUP
          </button>
        </Link>
        {/* Add dropdown items */}
    </div>
  )
}

export default Profile;

export const WithUserDataProfile = ()=>{
  const {user, setUser} = useContext(UserContext);
  // const updateProfile = ()=>{
  //   
  // }
  const logoutButtonClick = async()=>{
    const res = await logoutAPI();
    setUser(null);
  }

  return (
    <div
        id="profile-dropdown-menu"
        className="bg-white z-20 shadow-lg py-6 px-6 rounded-sm sm:min-w-[320px] max-sm:min-w-[250px] absolute right-0 top-10"
    >
        <h6 className="font-semibold text-[15px]">{user?.user?.name || "user name"}</h6>
        
        <p className="text-sm text-gray-500 mt-1">
        {user?.user?.bio || "Default bio"}
        </p>
        <p className="text-sm text-gray-500 mt-1">
        Email : {user?.user?.email || "May be did not login"}
        </p>
        
          <button onClick={()=>logoutButtonClick()} className="bg-transparent border border-gray-300 hover:border-black rounded-sm px-4 py-2 mt-4 text-sm text-slate-900 font-medium cursor-pointer">
            Logout
          </button>
        {/* Add dropdown items */}
    </div>
  )
}

