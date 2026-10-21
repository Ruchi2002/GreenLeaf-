import { redirect } from 'next/navigation';

// All roles log in from the single portal login page
export default function AdminLoginPage() {
  redirect(`${process.env.NEXT_PUBLIC_PORTAL_URL}/login`);
}
