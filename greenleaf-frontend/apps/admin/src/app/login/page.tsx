import { redirect } from 'next/navigation';

// All roles log in from the single portal login page
export default function AdminLoginPage() {
  redirect('http://localhost:3000/login');
}
