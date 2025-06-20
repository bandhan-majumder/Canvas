"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';

function Page() {
    const router = useRouter();
    const [canvasName, setCanvasName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const createCanvasHandler = async () => {
        if (loading) return; // Prevent multiple submissions
        setLoading(true);
        const trimmedName = canvasName.replace(/\s+/g, '');

        if (!trimmedName) {
            toast.error('Canvas name cannot be empty');
            return;
        }

        const body = {
            slug: trimmedName
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
            router.push(`/canvas/${data.slug}`);
            setCanvasName(''); 
            setLoading(false);
        } else {
            const errorData = await response.json();
            toast.error(errorData.message || 'Failed to create canvas');
        }
    }
    return (
        <div className='bg-black h-screen flex flex-col justify-center items-center'>
            <input
                maxLength={13}
                type="text"
                placeholder='ex: sample-canvas'
                className='bg-gray-600 border-2 border-gray-300 rounded-md p-4 text-white font-medium text-md bg-none'
                onChange={(e) => setCanvasName(e.target.value)}
                value={canvasName}
            />
            <button className=' text-black bg-[#B2AEFF] mt-10 p-2 rounded-xl cursor-pointer' onClick={createCanvasHandler}>{loading ? "Creating..." : "Create canvas"}</button>
        </div>
    )
}

export default Page