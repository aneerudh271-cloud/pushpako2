import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import InvestorDashboard from '@/components/Pages/Dashboard/investors/Index';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db/connectDB';
import Investor from '@/lib/models/Investor';

export default async function InvestorDashboardPage({ params }) {
  const { id } = await params;

  // Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/sign-in');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    redirect('/sign-in');
  }

  // Check if user can access this investor dashboard
  if (decoded.role === 'hackathon_manager') {
    redirect('/dashboards/hackathon-managers');
  }

  // Investors can only see their own dashboard. Admins can see anyone's.
  if (decoded.role === 'investor' && decoded.id !== id) {
    redirect(`/dashboards/investors/${decoded.id}`);
  }

  // Fetch investor data from DB
  await connectDB();
  const investor = await Investor.findById(id).lean();

  if (!investor) {
    redirect('/sign-in');
  }

  // Convert MongoDB _id to string and remove sensitive data
  const investorData = {
    ...investor,
    id: investor._id.toString(),
    _id: undefined,
    password: undefined,
    resetToken: undefined,
    resetTokenExpiry: undefined,
  };

  return (
    <main>
      <InvestorDashboard investor={investorData} />
    </main>
  );
}