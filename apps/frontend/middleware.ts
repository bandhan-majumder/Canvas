import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value ||
        request.headers.get('authorization')?.split(' ')[1];

    console.log("Request object is: ", request);
    console.log("Headers token: ", request.headers.get('authorization'));

    if (!token) {
        const url = request.url.replace(request.nextUrl.pathname, '/signin');
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/canvaswe/:roomId*', '/canvaswe'
    ]
};