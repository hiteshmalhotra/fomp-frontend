import type { MenuItemProps } from 'antd'
import type { UserRole } from '@/types/auth.types'
import type { MenuItemConfig } from './menuConfig'
import { getMenuIcon } from './menuIcons'

/**
 * Recursively filters the menu tree by role and converts to
 * Ant Design's MenuItem format. Pure function — no hooks, no state.
 *
 * O/C principle: adding a new role or depth level requires zero changes here.
 */
export const buildMenuForRole = (
  items: MenuItemConfig[],
  role: UserRole | null
): MenuItemProps[] => {
  if (!role) return []

  return items
    .filter((item) => item.roles.includes(role))
    .map((item) => {
      const filteredChildren = item.children
        ? buildMenuForRole(item.children, role)
        : undefined

      // If a parent has children config but none pass the role filter, skip it
      if (item.children && (!filteredChildren || filteredChildren.length === 0)) {
        return null
      }

      return {
        key: item.key,
        label: item.label,
        icon: item.icon ? getMenuIcon(item.icon) : undefined,
        children:
          filteredChildren && filteredChildren.length > 0
            ? filteredChildren
            : undefined,
      }
    })
    .filter(Boolean) as MenuItemProps[]
}

/**
 * Find the matching menu key for the current path.
 * Walks deepest-first so /store/challan/received/packed
 * matches before /store/challan.
 */
export const findSelectedKeys = (
  items: MenuItemConfig[],
  pathname: string
): string[] => {
  const keys: string[] = []

  const walk = (list: MenuItemConfig[]) => {
    for (const item of list) {
      if (item.children) walk(item.children)
      if (pathname.startsWith(item.key)) {
        keys.push(item.key)
      }
    }
  }

  walk(items)
  // Return the most specific (longest) match
  keys.sort((a, b) => b.length - a.length)
  return keys.length > 0 ? [keys[0]] : []
}

/**
 * Find open submenu keys — which parent menus should be expanded
 * for the current path. E.g. path /store/challan/received/packed
 * → openKeys: ['/store', '/store/challan', '/store/challan/received']
 */
export const findOpenKeys = (
  items: MenuItemConfig[],
  pathname: string
): string[] => {
  const openKeys: string[] = []

  const walk = (list: MenuItemConfig[], parents: string[]): boolean => {
    for (const item of list) {
      if (pathname.startsWith(item.key) && item.children) {
        openKeys.push(item.key)
        walk(item.children, [...parents, item.key])
        return true
      }
    }
    return false
  }

  walk(items, [])
  return openKeys
}