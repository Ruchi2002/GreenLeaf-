import { UserHero }           from '@/components/dashboard/UserHero';
import { RankProgressBar }    from '@/components/dashboard/RankProgressBar';
import { WalletStatCards }    from '@/components/dashboard/WalletStatCards';
import { BinaryLegsCard }     from '@/components/dashboard/BinaryLegsCard';
import { PVOverviewChart }    from '@/components/dashboard/PVOverviewChart';
import { BonusBreakdownCard } from '@/components/dashboard/BonusBreakdownCard';
import { QuickActions }       from '@/components/dashboard/QuickActions';
import { RecentActivity }     from '@/components/dashboard/RecentActivity';
import { Announcements }      from '@/components/dashboard/Announcements';

// MOCK ONLY — BACKEND_REQUIRED_LATER
const mockMember = {
  name:      'Rohit',
  initials:  'RH',
  memberId:  'RP97850827',
  cardLevel: 'Platinum Card',
  greeting:  'Good evening',
};

const walletCards = [
  { label: 'E-wallet balance',   value: 'RP 1.000.000', subtext: 'Updated today' },
  { label: 'Shopping vouchers',  value: 'RP 0',         subtext: 'No active vouchers' },
  { label: 'Travel points',      value: '0',            subtext: 'Not yet earned' },
  { label: "This month's bonus", value: 'RP 0',         subtext: 'No payout yet' },
];

const mockBinaryLegs = {
  leftPV:       0,
  leftMembers:  0,
  rightPV:      385,
  rightMembers: 12,
  tip:          'Strengthen your left leg to earn Group Bonus',
};

const mockPVChart = [
  { month: 'Apr', registrationPV: 80,  repurchasePV: 40 },
  { month: 'May', registrationPV: 120, repurchasePV: 60 },
  { month: 'Jun', registrationPV: 100, repurchasePV: 80 },
  { month: 'Jul', registrationPV: 90,  repurchasePV: 50 },
  { month: 'Aug', registrationPV: 110, repurchasePV: 70 },
  { month: 'Sep', registrationPV: 60,  repurchasePV: 90 },
];

const mockBonusBreakdown = {
  total:        'RP 207.500',
  earnedRaw:    207500,
  remainderRaw: 292500,
  items: [
    { label: 'Sponsor Bonus (RB)',           amount: 'RP 150.000' },
    { label: 'Group Bonus (GB)',             amount: 'RP 0' },
    { label: 'Layer Bonus (SB)',             amount: 'RP 45.000' },
    { label: 'Leadership Bonus (LS)',        amount: 'RP 0' },
    { label: 'Leadership Award 3% Dividend', amount: 'RP 0' },
    { label: 'Unilever Bonus (MB)',          amount: 'RP 0' },
    { label: '10% Self Repeat Rebate (MS)', amount: 'RP 12.500' },
  ],
};

export function MemberDashboard() {
  return (
    <div className="pt-14">
      <UserHero
        name={mockMember.name}
        initials={mockMember.initials}
        memberId={mockMember.memberId}
        cardLevel={mockMember.cardLevel}
        greeting={mockMember.greeting}
      />

      <RankProgressBar nextLevel="Diamond" percentage={65} />

      <WalletStatCards cards={walletCards} />

      <BinaryLegsCard
        leftPV={mockBinaryLegs.leftPV}
        leftMembers={mockBinaryLegs.leftMembers}
        rightPV={mockBinaryLegs.rightPV}
        rightMembers={mockBinaryLegs.rightMembers}
        tip={mockBinaryLegs.tip}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3">
          <PVOverviewChart data={mockPVChart} />
        </div>
        <div className="lg:col-span-2">
          <BonusBreakdownCard
            total={mockBonusBreakdown.total}
            earnedRaw={mockBonusBreakdown.earnedRaw}
            remainderRaw={mockBonusBreakdown.remainderRaw}
            items={mockBonusBreakdown.items}
          />
        </div>
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <Announcements />
        </div>
      </div>
    </div>
  );
}
