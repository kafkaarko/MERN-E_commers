'use client';

import Cart from "@/app/cart/page";
import { API } from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



type Token = {
  _id : string
  role: string
  name : string
  email: string
}


const Navbar = ({token}: {token: string | null}) => {
  
  const isLoggedIn = !!token 
  const router = useRouter()
  const[error, setError] = useState(null)
  // console.log("Token received in Navbar:", token);

  let user : Token | null = null

  if(token){
    user = jwtDecode<Token>(token)
  }

  const CartUser = () =>{
    try {
      API.get('cart',{withCredentials:true})
      router.push('/cart')
    } catch (error: any) {
      setError(error.message)
    }
  }

  const loggout = async() =>{
    try {
      await API.post('user/logout', {}, {withCredentials: true})
      router.push('/login')
    } catch (error: unknown) {
      console.log(error.message)
    }
  }
  return (
<div className="navbar bg-gray-700 shadow-sm">
      {/* Brand/Logo */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl text-white">Belajaain</a>
      </div>

      {/* Navigation Items */}
      <div className="flex-none">
        <div className="flex items-center gap-10">
          {/* Cart Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item bg-red-500 text-white border-0">3</span>
              </div>
            </div>

            {/* Cart Dropdown Content */}
            
            <div tabIndex={0} className="card card-compact dropdown-content bg-white z-[1] mt-3 w-52 shadow-lg border">
              <div className="card-body">
                <span className="text-lg font-bold text-gray-900">3 Items</span>
                <span className="text-blue-600 font-medium">Subtotal: $99.00</span>
                <div className="card-actions">
                  <button type="submit" onClick={CartUser} className="btn bg-blue-600 hover:bg-blue-700 text-white border-0 btn-block">View cart</button>
                </div>
              </div>
            </div>
            
          </div>

          {/* User Avatar Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <Image alt="User avatar" src="/vercel.svg" width={40} height={40} />
              </div>
            </div>

            {/* User Menu Dropdown */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border"
            >
              <li>
                {user ? (
                <p className="justify-between text-gray-900 hover:bg-gray-100 rounded-md">
                  Your role is {user?.role}
                  {/* <span className="badge bg-green-500 text-white border-0 text-xs">New</span> */}
                </p>
                )
                :
              ''
              }
              </li>
              <li>
                <a className="text-gray-900 hover:bg-gray-100 rounded-md">Settings</a>
              </li>
              <li>
                <a className="text-gray-900 hover:bg-gray-100 rounded-md">Profile</a>
              </li>
              {!isLoggedIn ? (
              <li>
                <Link href={'/login'} className="text-gray-900 hover:bg-gray-100 rounded-md">Login</Link>
              </li>

              ):
              (
              <li>
                <a className="text-gray-900 hover:bg-gray-100 rounded-md" onClick={loggout}>Logout</a>
              </li>
              )
            
            }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
