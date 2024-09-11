import {
  ArrowLeftRight,
  BadgeDollarSign,
  Cable,
  Flag,
  LayoutDashboard,
  Receipt,
  Settings,
  Shield,
  ShieldHalf,
  Swords,
  WalletCards,
} from "lucide-react";

export const sidebarNav = [
  {
    title: "Dashboard",
    href: `/dashboard`,
    icon: LayoutDashboard,
  },
  // {
  //   title: "Bets",
  //   href: `/bets`,
  //   icon: Receipt,
  // },
  // {
  //   title: "Transations",
  //   href: `/transations`,
  //   icon: ArrowLeftRight,
  // },
  // {
  //   title: "Customers",
  //   href: `/customers`,
  //   icon: Users,
  // },
  {
    title: "Countries",
    href: `/countries`,
    icon: Flag,
  },
  {
    title: "Leagues",
    href: `/leagues`,
    icon: ShieldHalf,
  },
  {
    title: "Running Leagues",
    href: `/runningleagues`,
    icon: Cable,
  },
  {
    title: "Teams",
    href: `/teams`,
    icon: Shield,
  },
  {
    title: "Matches",
    href: `/matches`,
    icon: Swords,
  },
  {
    title: "Betting Market",
    href: `/bettingMarkets`,
    icon: BadgeDollarSign,
  },
  {
    title: "Payments",
    href: `/payments`,
    icon: WalletCards,
  },
  {
    title: "Settings",
    href: `/settings`,
    icon: Settings,
  },
];
export const adminNav = [
  {
    title: "Dashboard",
    href: `/dashboard`,
    icon: LayoutDashboard,
  },
  {
    title: "Bets",
    href: `/bets`,
    icon: Receipt,
  },
  {
    title: "Transations",
    href: `/transations`,
    icon: ArrowLeftRight,
  },
  {
    title: "Matches",
    href: `/matches`,
    icon: Swords,
  },
  {
    title: "Betting Market",
    href: `/bettingMarkets`,
    icon: BadgeDollarSign,
  },
  {
    title: "Payments",
    href: `/payments`,
    icon: WalletCards,
  },
  // {
  //   title: "Settings",
  //   href: `/settings`,
  //   icon: Settings,
  // },
];

export const settingSidebar = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Admins",
    href: "/settings/admin",
  },
];
