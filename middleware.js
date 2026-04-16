import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  if (pathname.startsWith('/dashboards/')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirect to sign-in if no token cookie exists
      if (pathname.startsWith('/dashboards/hackathon-managers')) {
        return NextResponse.redirect(new URL('/manager-login', request.url));
      }
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback-secret'
      );

      const { payload } = await jwtVerify(token, secret);
      const { role, id } = payload;

      // Role: ADMIN
      if (role === 'admin') {
        // Admins can ONLY access /dashboards/admin (based on previous logic)
        // If they try to go to investor dashboard, redirect them back to admin?
        // Or maybe admins SHOULD be able to see investor dashboards?
        // The previous code redirected:
        // if (!pathname.startsWith('/dashboards/admin')) { ...redirect... }

        // Let's assume strict separation for now to match original intent.
        if (!pathname.startsWith('/dashboards/admin')) {
          return NextResponse.redirect(new URL('/dashboards/admin', request.url));
        }
        return NextResponse.next();
      }

      // Role: HACKATHON_MANAGER
      if (role === 'hackathon_manager') {
        // Hackathon managers can only access /dashboards/hackathon-managers
        if (!pathname.startsWith('/dashboards/hackathon-managers')) {
          return NextResponse.redirect(new URL('/dashboards/hackathon-managers', request.url));
        }
        return NextResponse.next();
      }

      // Role: INVESTOR
      if (role === 'investor') {
        // Investors cannot access admin dashboard
        if (pathname.startsWith('/dashboards/admin')) {
          return NextResponse.json({ error: "Access Denied" }, { status: 403 }); // Returning JSON might be weird for middleware page loads, better to redirect home or self.
          // Correct: redirect to their own dashboard
          return NextResponse.redirect(new URL(`/dashboards/investors/${id}`, request.url));
        }

        // Investors can only access their OWN dashboard
        if (pathname.startsWith('/dashboards/investors/')) {
          // Extract ID from path: /dashboards/investors/123...
          const pathParts = pathname.split('/dashboards/investors/');
          if (pathParts.length > 1) {
            const pathId = pathParts[1].split('/')[0];
            if (pathId !== id) {
              return NextResponse.redirect(new URL(`/dashboards/investors/${id}`, request.url));
            }
          }
        }
        return NextResponse.next();
      }

      // Role: HACKATHON_USER (Student/Participant)
      if (role === 'hackathon_user') {
        if (!pathname.startsWith('/dashboards/student')) {
          return NextResponse.redirect(new URL('/dashboards/student', request.url));
        }
        return NextResponse.next();
      }

      // Unknown role
      return NextResponse.redirect(new URL('/sign-in', request.url));

    } catch (error) {
      // Token verification failed (expired, invalid, etc.)
      console.error('Middleware auth error:', error);
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboards/:path*'],
};
