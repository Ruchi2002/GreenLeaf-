import Link from 'next/link';
import { ShoppingBag, Users, Wallet, ArrowRightLeft } from 'lucide-react';

const ACTIONS = [
  { label: 'Shop products',    href: '/shop',    Icon: ShoppingBag,      color: 'bg-primary-soft',             iconColor: 'text-primary' },
  { label: 'View my network',  href: '/network',         Icon: Users,    color: 'bg-primary-soft',             iconColor: 'text-primary' },
  { label: 'Recharge wallet',  href: '/wallet',  Icon: Wallet,           color: 'bg-[#FEF3C7] dark:bg-[#2C2004]', iconColor: 'text-gold' },
  { label: 'Transfer',         href: '/wallet',  Icon: ArrowRightLeft,   color: 'bg-[#FEF3C7] dark:bg-[#2C2004]', iconColor: 'text-gold' },
] as const;

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {ACTIONS.map(({ label, href, Icon, color, iconColor }) => (
        <Link
          key={label}
          href={href}
          className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors"
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <span className="text-sm font-medium text-text">{label}</span>
        </Link>
      ))}
    </div>
  );
}
