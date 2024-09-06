import {
  ArrowLeftRight,
  BadgeDollarSign,
  Flag,
  Home,
  LayoutDashboard,
  Receipt,
  Settings,
  Shield,
  ShieldHalf,
  Swords,
  Users,
  WalletCards,
} from "lucide-react";

export const sidebarNav = [
  {
    title: "Dashboard",
    href: `/backoffice/dashboard`,
    icon: LayoutDashboard,
  },
  {
    title: "Bets",
    href: `/backoffice/bets`,
    icon: Receipt,
  },
  {
    title: "Transations",
    href: `/backoffice/transations`,
    icon: ArrowLeftRight,
  },
  {
    title: "Customers",
    href: `/backoffice/customers`,
    icon: Users,
  },
  {
    title: "Leagues",
    href: `/backoffice/leagues`,
    icon: ShieldHalf,
  },
  {
    title: "Countries",
    href: `/backoffice/countries`,
    icon: Flag,
  },
  {
    title: "Teams",
    href: `/backoffice/teams`,
    icon: Shield,
  },
  {
    title: "Matches",
    href: `/backoffice/matches`,
    icon: Swords,
  },
  {
    title: "Betting Market",
    href: `/backoffice/bettingMarkets`,
    icon: BadgeDollarSign,
  },
  {
    title: "Payments",
    href: `/backoffice/payments`,
    icon: WalletCards,
  },
  {
    title: "Settings",
    href: `/backoffice/settings`,
    icon: Settings,
  },
];
export const adminNav = [
  {
    title: "Dashboard",
    href: `/backoffice/dashboard`,
    icon: LayoutDashboard,
  },
  {
    title: "Bets",
    href: `/backoffice/bets`,
    icon: Receipt,
  },
  {
    title: "Transations",
    href: `/backoffice/transations`,
    icon: ArrowLeftRight,
  },
  {
    title: "Matches",
    href: `/backoffice/matches`,
    icon: Swords,
  },
  {
    title: "Betting Market",
    href: `/backoffice/bettingMarkets`,
    icon: BadgeDollarSign,
  },
  {
    title: "Payments",
    href: `/backoffice/payments`,
    icon: WalletCards,
  },
  // {
  //   title: "Settings",
  //   href: `/backoffice/settings`,
  //   icon: Settings,
  // },
];

export const clientNav = [
  {
    title: "Home",
    href: `/`,
    icon: Home,
  },
  {
    title: "Bet History",
    href: `/bethistory`,
    icon: Receipt,
  },
  {
    title: "Transations",
    href: `/transations`,
    icon: ArrowLeftRight,
  },

  {
    title: "Settings",
    href: `/settings`,
    icon: Settings,
  },
];
