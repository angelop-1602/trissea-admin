import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { RoadHorizon } from '@phosphor-icons/react/dist/ssr/RoadHorizon';
import { Database } from '@phosphor-icons/react/dist/ssr/Database';
import { SteeringWheel as SteeringWheelIcon } from '@phosphor-icons/react/dist/ssr/SteeringWheel';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'steering-wheel': SteeringWheelIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'road-horizon': RoadHorizon,
  'database': Database,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
