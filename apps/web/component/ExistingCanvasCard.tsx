import React from 'react'

export interface Canvas {
  id: string;
  slug: string;
  createdAt: string;
  userId: string;
}

function ExistingCanvasCard({canvas, joinCanvasHandler}: {
  canvas: Canvas;
  joinCanvasHandler: (slug: string) => void;
}) {
    if (!canvas || !joinCanvasHandler) {
        return null; 
    }
    return (
        <div
            key={canvas.id}
            className='bg-gray-800 border border-gray-600 rounded-lg p-6 hover:bg-gray-700 transition-colors'
        >
            <h3 className='text-white text-lg font-semibold mb-2'>{canvas.slug}</h3>
            <p className='text-gray-400 text-sm mb-4'>
                Created: {new Date(canvas.createdAt).toLocaleDateString()}
            </p>
            <button
                onClick={() => joinCanvasHandler(canvas.slug)}
                className='w-full bg-[#B2AEFF] hover:bg-[#9B8EFF] text-black py-2 px-4 rounded-md font-medium transition-colors cursor-pointer'
            >
                Join
            </button>
        </div>
    )
}

export default ExistingCanvasCard