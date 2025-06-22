"use client";
import { signOut, useSession } from 'next-auth/react';

function UserProfileDropDown() {
    const { data: session, status } = useSession();


    if (status === "loading") return <div>Loading...</div>;

    if (status === "unauthenticated") return <div>
        Please log in to access your profile.
    </div>;
    
    return (
        <div className='top-16 right-4 bg-red-400 text-white shadow-lg rounded-lg p-4 z-50 cursor-pointer'
        onClick={() => signOut({ callbackUrl: '/' })}>
            logout
        </div>
    );
}

export default UserProfileDropDown;