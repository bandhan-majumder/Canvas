"use client";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { getAllRoomInfo } from '@/draw/helper';
import ExistingCanvasCard, { Canvas } from './ExistingCanvasCard';
import { CanvasCardSkeleton, CanvasListSkeleton } from './ExistingCardsSkeleton';

function JoinCanvas() {
  const router = useRouter();
  const [canvasName, setCanvasName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [fetchingCanvases, setFetchingCanvases] = useState<boolean>(true);

  useEffect(() => {
    const getAllRooms = async () => {
      try {
        const response = await getAllRoomInfo();
        console.log("All room info: ", response);
        setCanvases(response || []);
      } catch (error) {
        console.error("Error fetching all rooms: ", error);
        toast.error('Failed to fetch room information');
      } finally {
        setFetchingCanvases(false);
      }
    };

    getAllRooms();
  }, []);

  const createCanvasHandler = async () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    const trimmedName = canvasName.replace(/\s+/g, '');
    if (!trimmedName) {
      toast.error('Canvas name cannot be empty');
      setLoading(false);
      return;
    }

    const body = {
      slug: trimmedName
    }

    try {
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
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create canvas');
      }
    } catch (error) {
      console.error('Error creating canvas:', error);
      toast.error('Failed to create canvas');
    } finally {
      setLoading(false);
    }
  }

  const joinCanvasHandler = (slug: string) => {
    router.push(`/canvas/${slug}`);
  }

  return (
    <div className='bg-black min-h-screen flex flex-col justify-center items-center p-8'>
      {/* Create Canvas Section */}
      <div className='mb-12 text-center'>
        <h2 className='text-white text-2xl font-bold mb-6'>Create New Canvas</h2>
        <input
          maxLength={13}
          type="text"
          placeholder='ex: sample-canvas'
          className='bg-gray-600 border-2 border-gray-300 rounded-md p-4 text-white font-medium text-md mb-4'
          onChange={(e) => setCanvasName(e.target.value)}
          value={canvasName}
        />
        <br />
        <button 
          className='text-black bg-[#B2AEFF] mt-4 px-6 py-3 rounded-xl cursor-pointer font-medium hover:bg-[#9B8EFF] transition-colors' 
          onClick={createCanvasHandler}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Canvas"}
        </button>
      </div>

      {/* Existing Canvases Section */}
      <div className='w-full max-w-4xl'>
        <h2 className='text-white text-2xl font-bold mb-6 text-center'>Join Existing Canvas</h2>
        
        {fetchingCanvases ? (
          <div className='text-white text-center'>
            <CanvasListSkeleton />
          </div>
        ) : canvases.length === 0 ? (
          <div className='text-gray-400 text-center'>No canvases available.</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {canvases.map((canvas) => (
              <ExistingCanvasCard
                key={canvas.id}
                canvas={canvas}
                joinCanvasHandler={joinCanvasHandler}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JoinCanvas