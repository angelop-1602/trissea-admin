import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'driver', title: 'Drivers', href: paths.dashboard.driver, icon: 'steering-wheel' },
  { key: 'customers', title: 'Passenger', href: paths.dashboard.passenger, icon: 'users' },
  { key: 'toda', title: 'Toda', href: paths.dashboard.toda, icon: 'road-horizon' },
  { key: 'driver', title: 'RealTime Drivers', href: paths.dashboard.realtimeDrivers, icon: 'database' },

] satisfies NavItemConfig[];
