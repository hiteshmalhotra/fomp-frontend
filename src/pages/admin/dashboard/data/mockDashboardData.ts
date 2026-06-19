import type {
  StatCardData,
  UserRow,
  ServiceHealth,
  ActivityItem,
  LoginActivityPoint,
} from '../type/dashboard.types'

export const mockStatCards: StatCardData[] = [
  {
    id: 'total-users',
    label: 'Total Users',
    value: '1,245',
    change: '+12.4% vs last month',
    trend: 'up',
    icon: 'users',
    iconBg: '#dcfce7',
  },
  {
    id: 'active-sessions',
    label: 'Active Sessions',
    value: '327',
    change: '+8.6% vs last month',
    trend: 'up',
    icon: 'activity',
    iconBg: '#dbeafe',
  },
  {
    id: 'services-health',
    label: 'Services Health',
    value: '99.8%',
    change: '+1.2% vs last month',
    trend: 'up',
    icon: 'server',
    iconBg: '#dcfce7',
  },
  {
    id: 'pending-approvals',
    label: 'Pending Approvals',
    value: '18',
    change: '-5.3% vs last month',
    trend: 'down',
    icon: 'clipboard',
    iconBg: '#fef3c7',
  },
]

export const mockUsers: UserRow[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Admin', department: 'IT Department', lastLogin: 'May 21, 2025 10:30 AM', status: 'active' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', role: 'Store Manager', department: 'Store Operations', lastLogin: 'May 21, 2025 09:15 AM', status: 'active' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@company.com', role: 'Kitchen Manager', department: 'Kitchen Operations', lastLogin: 'May 20, 2025 06:45 PM', status: 'active' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'Canteen Manager', department: 'Canteen Operations', lastLogin: 'May 20, 2025 04:20 PM', status: 'active' },
  { id: '5', name: 'David Lee', email: 'david.lee@company.com', role: 'Store Manager', department: 'Store Operations', lastLogin: 'May 20, 2025 11:10 AM', status: 'inactive' },
  { id: '6', name: 'Jessica Taylor', email: 'jessica.taylor@company.com', role: 'Canteen Manager', department: 'Canteen Operations', lastLogin: 'May 19, 2025 03:35 PM', status: 'active' },
  { id: '7', name: 'Daniel Clark', email: 'daniel.clark@company.com', role: 'Kitchen Manager', department: 'Kitchen Operations', lastLogin: 'May 19, 2025 09:50 AM', status: 'inactive' },
]

export const mockServiceHealth: ServiceHealth[] = [
  { name: 'Authentication Service', status: 'healthy' },
  { name: 'User Service', status: 'healthy' },
  { name: 'Inventory Service', status: 'healthy' },
  { name: 'Notification Service', status: 'healthy' },
]

export const mockLoginActivity: LoginActivityPoint[] = [
  { date: 'May 15', count: 620 },
  { date: 'May 16', count: 540 },
  { date: 'May 17', count: 610 },
  { date: 'May 18', count: 720 },
  { date: 'May 19', count: 690 },
  { date: 'May 20', count: 780 },
  { date: 'May 21', count: 892 },
]

export const mockActivities: ActivityItem[] = [
  { id: '1', icon: 'user', title: 'New user John Doe created by System Admin', timestamp: 'May 21, 2025 10:30 AM' },
  { id: '2', icon: 'role', title: 'Role updated for Sarah Wilson', timestamp: 'May 21, 2025 09:15 AM' },
  { id: '3', icon: 'login', title: 'User Michael Brown logged in', timestamp: 'May 20, 2025 06:45 PM' },
  { id: '4', icon: 'permission', title: 'Permissions updated for Store Manager role', timestamp: 'May 20, 2025 05:20 PM' },
]