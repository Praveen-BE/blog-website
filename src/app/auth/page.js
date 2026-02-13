"use client"; // if you're using Next.js 13+ with app router
import { UserContext } from '../../context/UserContext';
import { loginAPI } from '@/lib/authApi';
import React, { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';


const AuthPage = () => {
        const [isLoginForm, setIsLoginForm] = useState(true);
        const signupnameRef = useRef(null);
        const signupemailRef = useRef(null);
        const signupCreatePasswordRef = useRef(null);
        const signupConfirmPasswordRef = useRef(null);

        const loginEmailRef = useRef(null);
        const loginPasswordRef = useRef(null);

        const {setUser} = useContext(UserContext);

        const router = useRouter();

        const loginApiCall= async()=>{
            // console.log(loginEmailRef.current);
            // console.log(loginPasswordRef.current);
            const email = loginEmailRef.current?.value;
            const password = loginPasswordRef.current?.value;
            const res = await loginAPI({loginEmail:email, loginPassword: password});
            console.log(res);
            setUser(res);
            router.push("/");
        }
  return (
    <div>
        {isLoginForm?
        <form className="space-y-4 max-w-md mx-auto mt-4">
            <h2 className='text-center font-medium text-xl'>Login</h2>
        <input ref={loginEmailRef} type="email" placeholder="Enter Email"
            className="px-4 py-3 text-slate-900 bg-gray-100 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded-md" />

        <input ref={loginPasswordRef} type="password" placeholder="Enter Password"
            className="px-4 py-3 text-slate-900 bg-gray-100 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded-md" />

        <div className="flex">
            <input type="checkbox" className="w-4" />
            <label className="text-sm ml-4 text-slate-900">Remember me</label>
        </div>

        <button type="button" onClick={loginApiCall}
            className="mt-8! w-full px-4 py-2.5 mx-auto block text-[15px] font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                Submit
        </button>
        <p>Want to Create New One ?. <span onClick={()=>setIsLoginForm(false)} 
        className='text-red-500 font-bold'> Sign up</span></p>
        </form>
        :
    <form className="space-y-4 max-w-md mx-auto mt-4">
        <h2 className='text-center font-medium text-xl'>Sign Up</h2>

        <input ref={signupnameRef} type="name" placeholder="Enter Your Name"
            class="px-4 py-3 text-slate-900 bg-gray-100 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded-md" />
        
        <input ref={signupemailRef} type="email" placeholder="Enter Email"
            className="px-4 py-3 text-slate-900 bg-gray-100 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded-md" />

        <input ref={signupCreatePasswordRef} type="password" placeholder="New Password"
            className="px-4 py-3 text-slate-900 bg-gray-100 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded-md" />

        <input ref={signupConfirmPasswordRef} type="password" placeholder="Confirm Password"
            className="px-4 py-3 text-slate-900 bg-gray-100 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded-md" />


        <div className="flex">
            <input type="checkbox" class="w-4" />
            <label className="text-sm ml-4 text-slate-900">Remember me</label>
        </div>

        <button type="button"
            className="mt-8! w-full px-4 py-2.5 mx-auto block text-[15px] font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                Submit
        </button>
        <p>Already have an account ?. 
            <span onClick={()=>setIsLoginForm(true)}
                className='text-red-500 font-bold'> Login</span>
        </p>
    </form>
    }
    </div>
  )
}

export default AuthPage;