"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';

function Page() {
    const router = useRouter();
    const [canvasName, setCanvasName] = useState<string>('');
    const createCanvasHandler = async () => {
        const body = {
            slug: canvasName
        }
        
        const response = await fetch(`/api/canvas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.status === 200) {
            toast.success('Canvas created successfully');
            const data = await response.json();
            router.push(`/canvas/${data.roomId}`);
        } else {
            const errorData = await response.json();
            toast.error(errorData.message || 'Failed to create canvas');
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