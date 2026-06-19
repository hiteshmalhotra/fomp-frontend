import {
  DashboardOutlined,
  TeamOutlined,
  SafetyOutlined,
  ShopOutlined,
  CoffeeOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  AuditOutlined,
  SettingOutlined,
  BookOutlined,
  FileTextOutlined,
  SendOutlined,
  SwapOutlined,
  InboxOutlined,
  DropboxOutlined,
  GiftOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

const icons: Record<string, ReactNode> = {
  dashboard:   <DashboardOutlined />,
  users:       <TeamOutlined />,
  roles:       <SafetyOutlined />,
  stores:      <ShopOutlined />,
  kitchens:    <CoffeeOutlined />,
  canteens:    <AppstoreOutlined />,
  inventory:   <DatabaseOutlined />,
  reports:     <BarChartOutlined />,
  audit:       <AuditOutlined />,
  settings:    <SettingOutlined />,
  daybook:     <BookOutlined />,
  ledger:      <FileTextOutlined />,
  po:          <SendOutlined />,
  challan:     <SwapOutlined />,
  received:    <InboxOutlined />,
  packed:      <DropboxOutlined />,
  unpacked:    <GiftOutlined />,
  request:     <SendOutlined />,
  transfer:    <SwapOutlined />,
}

export const getMenuIcon = (key: string): ReactNode => icons[key] ?? null