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
        <div>
            <input type="text" placeholder='Enter a name for your canvas' className='border-2 border-gray-300 rounded-md p-2' onChange={(e) => setCanvasName(e.target.value)} />
            <button className='bg-black text-white' onClick={createCanvasHandler}>Create a canvas</button>
        </div>
    )
}

export default Page