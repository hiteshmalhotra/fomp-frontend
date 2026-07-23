import type { ThemeConfig } from 'antd'
import type { TextScale } from '@/store/preferences.store'

// System font stack — Inter was referenced but never loaded, so every
// browser silently fell back anyway. System fonts render instantly
// with zero layout shift.
const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

/**
 * Ant Design tokens — values mirror theme/tokens.css.
 * Light theme only (product decision: elderly users, no dark mode).
 */
export const fompTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1e40af',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorInfo: '#2563eb',
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorText: '#1e293b',
    colorTextSecondary: '#475569',
    colorTextTertiary: '#94a3b8',
    colorTextDisabled: '#cbd5e1',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 20,
    // Descending type scale — h3 must never render smaller than body text
    fontSizeHeading1: 28,
    fontSizeHeading2: 22,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    borderRadius: 6,
    borderRadiusLG: 8,
    controlHeight: 40,
    lineWidth: 1,
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      headerBg: '#ffffff',
      bodyBg: '#f8fafc',
      triggerBg: '#f1f5f9',
    },
    Menu: {
      itemBg: '#ffffff',
      subMenuItemBg: '#ffffff',
      itemSelectedBg: '#eff6ff',
      itemHoverBg: '#f1f5f9',
      itemColor: '#475569',
      itemSelectedColor: '#1e40af',
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#475569',
      rowHoverBg: '#f8fafc',
      borderColor: '#e2e8f0',
      bodySortBg: '#ffffff',
    },
    Card: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#e2e8f0',
    },
    Input: {
      colorBgContainer: '#ffffff',
      colorBorder: '#cbd5e1',
      activeBorderColor: '#1e40af',
      hoverBorderColor: '#1e40af',
    },
    Select: {
      colorBgContainer: '#ffffff',
      colorBorder: '#cbd5e1',
      optionActiveBg: '#f1f5f9',
      optionSelectedBg: '#eff6ff',
    },
    Button: {
      colorPrimary: '#1e40af',
      colorPrimaryHover: '#1d4ed8',
      defaultBg: '#ffffff',
      defaultBorderColor: '#cbd5e1',
      defaultColor: '#1e293b',
    },
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#ffffff',
    },
    Drawer: {
      colorBgElevated: '#ffffff',
    },
  },
}

/**
 * Returns the theme for the user's text-scale preference.
 * "large" bumps body text to 16px and controls to 44px — an
 * accessibility option surfaced in the header account menu.
 */
export const getFompTheme = (scale: TextScale): ThemeConfig => {
  if (scale !== 'large') return fompTheme
  return {
    ...fompTheme,
    token: {
      ...fompTheme.token,
      fontSize: 16,
      fontSizeLG: 18,
      fontSizeXL: 22,
      fontSizeHeading1: 32,
      fontSizeHeading2: 25,
      fontSizeHeading3: 20,
      fontSizeHeading4: 18,
      fontSizeHeading5: 16,
      controlHeight: 44,
    },
  }
}
