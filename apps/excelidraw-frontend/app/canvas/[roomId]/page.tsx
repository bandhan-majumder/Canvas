"use client";

import { initDraw } from '@/draw';
import React, { useEffect, useRef } from 'react'

function CanvasPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {

        if (canvasRef.current) {
            initDraw(canvasRef.current);
        }

    }, [canvasRef]);

    return (
        <div>
            <canvas ref={canvasRef} width={1000} height={1000}>

</canvas>
        </div>
    )
}

export default CanvasPage