// ============================================
// FILE: components/Header.js
// Navigation header component
// ============================================

"use client"; // if you're using Next.js 13+ with app router

import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import Profile, { WithUserDataProfile } from "./Profile";
import NavList from "./NavList";
import { UserContext } from "../context/UserContext";
import { getUserProfileByToken } from "@/lib/userProfileAPI";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {user,setUser} = useContext(UserContext);
  // console.log(user?.user);
  useEffect(()=>{
    getProfile();
  },[]);
  // useEffect(()=>{
  //   console.log("User updated:", user);
  // },[user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownOpen &&
        !event.target.closest("#profile-dropdown-toggle") &&
        !event.target.closest("#profile-dropdown-menu")
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);


  const getProfile = async () => {
  try {
    const userData = await getUserProfileByToken();
    if (!userData) {
      setUser(null);
    } else {
      setUser({ ...userData });
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    setUser(null);
  }
};


  return (
    <header className="flex shadow-md py-3 px-4 sm:px-10 bg-white min-h-17.5 tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between lg:gap-y-4 gap-y-6 gap-x-4 w-full">
        {/* Logo */}
        <a href="/">
          <Image src="/bloglogo-1.svg" alt="bloglogo-1" width={50} height={50}/>
        </a>

        {/* Collapse Menu */}
        <div
          id="collapseMenu"
          className={`${
            menuOpen ? "block" : "hidden"
          } max-lg:fixed max-lg:bg-white max-lg:w-2/3 max-lg:min-w-75 max-lg:top-0 max-lg:left-0 max-lg:p-4 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50 lg:block`}
        >
          <button
            id="toggleClose"
            onClick={() => setMenuOpen(false)}
            className="lg:hidden fixed top-2 right-4 z-100 rounded-full bg-white w-9 h-9 flex items-center justify-center border border-gray-200 cursor-pointer"
          >
            ✕
          </button>
          <NavList/>
        </div>

        {/* Right Side */}
        <div className="flex items-center max-sm:ml-auto space-x-6">
          {/* Profile Dropdown */}
          <ul>
            <li id="profile-dropdown-toggle" className="relative px-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                <Image className="border-2 rounded-[50%] border-black p-1" src="/dontInterestToSetProfile.svg" alt="dontInterestToProfileImageSVG" width={50} height={50}/>
              </button>

              {dropdownOpen && (
                user ?<WithUserDataProfile/>:
                <Profile/>
              )}
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            id="toggleOpen"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden ml-7 cursor-pointer size-12.5 text-black"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

