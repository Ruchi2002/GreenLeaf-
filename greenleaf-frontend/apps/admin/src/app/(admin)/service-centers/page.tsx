'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Store, UserCheck, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type SCStatus = 'Active' | 'Pending' | 'Suspended';

interface ServiceCenter {
  id:         string;
  scId:       string;
  ownerName:  string;
  initials:   string;
  city:       string;
  members:    number;
  monthlyPV:  number;
  status:     SCStatus;
  joined:     string;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_SERVICE_CENTERS: ServiceCenter[] = [
  { id: '1', scId: 'S200001', ownerName: 'Budi Santoso',      initials: 'BS', city: 'Jakarta',    members: 87,  monthlyPV: 42500, status: 'Active',    joined: '12 Jan 2024' },
  { id: '2', scId: 'S200002', ownerName: 'Dewi Rahayu',       initials: 'DR', city: 'Surabaya',   members: 54,  monthlyPV: 28300, status: 'Active',    joined: '3 Feb 2024'  },
  { id: '3', scId: 'S200003', ownerName: 'Agus Wijaya',       initials: 'AW', city: 'Bandung',    members: 31,  monthlyPV: 14750, status: 'Pending',   joined: '19 Mar 2024' },
  { id: '4', scId: 'S200004', ownerName: 'Siti Nurhaliza',    initials: 'SN', city: 'Medan',      members: 120, monthlyPV: 50000, status: 'Active',    joined: '5 Apr 2024'  },
  { id: '5', scId: 'S200005', ownerName: 'Rudi Hartono',      initials: 'RH', city: 'Yogyakarta', members: 22,  monthlyPV: 9800,  status: 'Pending',   joined: '28 Apr 2024' },
  { id: '6', scId: 'S200006', ownerName: 'Eka Prasetyo',      initials: 'EP', city: 'Semarang',   members: 15,  monthlyPV: 5200,  status: 'Suspended', joined: '11 May 2024' },
  { id: '7', scId: 'S200007', ownerName: 'Wahyu Kurniawan',   initials: 'WK', city: 'Makassar',   members: 68,  monthlyPV: 33100, status: 'Active',    joined: '7 Jun 2024'  },
  { id: '8', scId: 'S200008', ownerName: 'Fitri Handayani',   initials: 'FH', city: 'Palembang',  members: 39,  monthlyPV: 18600, status: 'Active',    joined: '22 Jun 2024' },
  { id: '9', scId: 'S200009', ownerName: 'Hendra Susanto',    initials: 'HS', city: 'Denpasar',   members: 27,  monthlyPV: 11400, status: 'Pending',   joined: '14 Jul 2024' },
  { id:'10', scId: 'S200010', ownerName: 'Lestari Wulandari', initials: 'LW', city: 'Balikpapan', members: 45,  monthlyPV: 22900, status: 'Active',    joined: '30 Jul 2024' },
];

const STATUS_CHIP: Record<SCStatus, string> = {
  Active:    'bg-green-100 text-green-700',
  Pending:   'bg-amber-100 text-amber-700',
  Suspended: 'bg-red-100 text-red-700',
};

const CITIES = ['All Cities', ...Array.from(new Set(MOCK_SERVICE_CENTERS.map((s) => s.city))).sort()];
const STATUSES: ('All' | SCStatus)[] = ['All', 'Active', 'Pending', 'Suspended'];

const STATS = [
  { label: 'Total SCs',               value: '10',   icon: Store,      iconBg: 'bg-green-100',   iconColor: 'text-green-700' },
  { label: 'Active SCs',              value: '6',    icon: UserCheck,  iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
  { label: 'Pending Approval',        value: '3',    icon: Clock,      iconBg: 'bg-amber-100',   iconColor: 'text-amber-700' },
  { label: 'Total Members Registered',value: '508',  icon: Users,      iconBg: 'bg-blue-100',    iconColor: 'text-blue-700' },
];

export default function ServiceCentersPage() {
  const router = useRouter();
  const [search,     setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | SCStatus>('All');
  const [cityFilter, setCityFilter] = useState('All Cities');

  const filtered = MOCK_SERVICE_CENTERS.filter((sc) => {
    const matchSearch = !search ||
      sc.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      sc.scId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || sc.status === statusFilter;
    const matchCity   = cityFilter === 'All Cities' || sc.city === cityFilter;
    return matchSearch && matchStatus && matchCity;
  });

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0a1f13] to-[#14532d] px-7 py-6 flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Service Centers</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/25 text-green-400">
              10 registered
            </span>
          </div>
          <p className="text-sm text-green-200/70">Manage service center accounts, approval status, and member registrations.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                  <Icon size={20} className={s.iconColor} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-72 sm:shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SC ID..."
            className="w-full pl-10 pr-4 h-9 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | SCStatus)}
          className="h-9 rounded-full border border-gray-200 bg-white text-sm text-gray-700 px-4 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="h-9 rounded-full border border-gray-200 bg-white text-sm text-gray-700 px-4 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['SC ID', 'OWNER', 'CITY', 'MEMBERS', 'MONTHLY PV', 'STATUS', 'JOINED', 'ACTIONS'].map((col) => (
                  <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((sc) => (
                <tr key={sc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {sc.scId}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-[11px] font-bold">{sc.initials}</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{sc.ownerName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">{sc.city}</td>
                  <td className="px-5 py-4 text-gray-900 font-semibold text-sm">{sc.members}</td>
                  <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">
                    {sc.monthlyPV.toLocaleString('en-IN')} PV
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full', STATUS_CHIP[sc.status])}>
                      {sc.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">{sc.joined}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => router.push(`/service-centers/${sc.id}`)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {filtered.length} of {MOCK_SERVICE_CENTERS.length} service centers</p>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map((sc) => (
          <div key={sc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{sc.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{sc.ownerName}</p>
                  <span className="text-[10px] font-mono font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {sc.scId}
                  </span>
                </div>
              </div>
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0', STATUS_CHIP[sc.status])}>
                {sc.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
              <span>{sc.city}</span>
              <span>{sc.members} members</span>
              <span>{sc.monthlyPV.toLocaleString('en-IN')} PV/mo</span>
              <span>Joined {sc.joined}</span>
            </div>

            <button
              onClick={() => router.push(`/service-centers/${sc.id}`)}
              className="w-full py-2 rounded-lg border border-green-600 text-green-700 text-xs font-semibold hover:bg-green-50 transition-colors"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
