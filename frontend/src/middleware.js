import { NextResponse } from 'next/server'
import { deleteToken } from './app/utils/requestBuilder';

export default function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path === '/expired') {
    const allowed = request.cookies.get('expired_redirect');
    if (!allowed) {
      return NextResponse.redirect(new URL('/', request.url)); 
    }
    const response = NextResponse.next();
    response.cookies.delete('expired_redirect');
    return response;
  }
  const token = request.cookies.get('token');


  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  let payload;
  try{
    payload = JSON.parse(
      Buffer.from(token.value.split('.')[1], 'base64').toString()
    );
  }catch(err){
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('token');
    return response;
  }
  
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    const response = NextResponse.redirect(new URL('/expired', request.url));
    response.cookies.set('expired_redirect', 'true', { httpOnly: true, maxAge: 10 });
    response.cookies.delete('token');
    return response;
  }




  return NextResponse.next();
}

// Proteger solo estas rutas:
export const config = {
  matcher: ['/dashboard/:path*', '/account','/expired'],
}