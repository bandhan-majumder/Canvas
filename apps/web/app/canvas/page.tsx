"use client";

import { HTTP_BACKEND_URL } from '@/config'
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function Page() {
    const router = useRouter();
    const [canvasName, setCanvasName] = useState<string>('');
    const createCanvasHandler = async () => {
        const body = {
            name: canvasName
        }
        const response = await axios.post(`${HTTP_BACKEND_URL}/create-room`, body, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.data.success) {
            router.push(`/canvas/${response.data.roomId}`);
        } else {
            alert('Failed to create canvas');
        }
    }
    return (
        <div className='bg-black h-screen flex flex-col justify-center items-center'>
            <input maxLength={13} type="text" placeholder='ex: sample-canvas' className='bg-gray-600 border-2 border-gray-300 rounded-md p-4 text-white font-medium text-md bg-none' onChange={(e) => setCanvasName(e.target.value)} />
            <button className=' text-black bg-[#B2AEFF] mt-10 p-2 rounded-xl' onClick={createCanvasHandler}>Create canvas</button>
        </div>
    )
}

export default Page