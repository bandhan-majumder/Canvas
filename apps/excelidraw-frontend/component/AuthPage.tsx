"use client";

import React from 'react'

function AuthPage({isSignIn}: {isSignIn: boolean}) {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <div className='p-2 m-2 rounded'>
            <input type="text" placeholder='email' className='p-2 m-2 border border-gray-300 rounded'/>
            <input type="password" placeholder='password' className='p-2 m-2 border border-gray-300 rounded'/>
            <button className='p-2 m-2 bg-blue-500 text-white rounded' onClick={() => {}}>
                {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
        </div>
    </div>
  )
}

export default AuthPage