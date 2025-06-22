import React from 'react';
import Image from 'next/image';

export const CanvasPreview = () => {
  return (
    <div>
      <div className='max-w-[90vw] max-h-[70vh] md:max-w-[50vw] md:max-h-[60vh] mx-auto my-10 border border-gray-700 rounded-lg overflow-hidden shadow-lg'>
      <div className='bg-gray-800 p-4 text-white text-center'>
        <h2 className='text-2xl font-bold'>Canvas Preview</h2>
        <p className='text-sm'>This is a preview of your canvas.</p>
      </div>
      <Image
        src="/image.png"
        alt="Canvas Preview"
        layout="responsive"
        width={400}
        height={475}
      />
    </div>
    <div className='max-w-[90vw] max-h-[70vh] md:max-w-[50vw] md:max-h-[60vh] mx-auto my-10 p-6 rounded-lg shadow-lg'>
      <p className='text-center text-gray-400 mt-2'>
        To get started, click on the "Get Started" button in the top right corner.
      </p>
      <p className='text-center text-gray-400 mt-2'>
        Currently we support circle, square and straight lines. More shapes will be added <span className='font-semibold'>soon</span>.
      </p>
    </div>
    </div>
  );
};
