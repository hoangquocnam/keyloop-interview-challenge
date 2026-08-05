export const FONT = {
  fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
  fontFamilyCode: '"IBM Plex Mono", "SFMono-Regular", monospace',
  fontSizeXs: 12,
  fontSizeSm: 13,
  fontSizeMd: 14,
  fontSizeLg: 16,
  fontSizeXl: 20,
  fontSize2Xl: 28,
  fontSizeDisplay: 40,
  lineHeight: 1.5,
  lineHeightHeading: 1.15,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
} as const

export const COLORS = {
  white: '#ffffff',
  black: '#141414',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#f0f0f0',
  gray300: '#d9d9d9',
  gray500: '#8c8c8c',
  gray700: '#595959',
  gray900: '#262626',
  text: '#141414',
  textSecondary: '#595959',
  textTertiary: '#8c8c8c',
  pageBg: '#f5f5f5',
  surface: '#ffffff',
  surfaceMuted: '#fafafa',
  border: '#d9d9d9',
  borderSecondary: '#f0f0f0',
  success: '#52c41a',
  error: '#ff4d4f',
  error_50: '#fff1f0',
  error_100: '#ffccc7',
  error_200: '#ffa39e',
  error_300: '#ff7875',
  error_400: '#ff4d4f',
  error_500: '#f5222d',
  error_600: '#cf1322',
  error_700: '#a8071a',
  error_800: '#820014',
  error_900: '#5c0011',
  warning_50: '#fffbe6',
  warning_100: '#fff1b8',
  warning_200: '#ffe58f',
  warning_300: '#ffd666',
  warning_400: '#ffc53d',
  warning_500: '#faad14',
  warning_600: '#d48806',
  warning_700: '#ad6800',
  warning_800: '#874d00',
  warning_900: '#613400',
  info_50: '#e6f7ff',
  info_100: '#bae7ff',
  info_200: '#91d5ff',
  info_300: '#69c0ff',
  info_400: '#40a9ff',
  info_500: '#1677ff',
  info_600: '#0958d9',
  info_700: '#003a8c',
  info_800: '#002766',
  info_900: '#001d4d',
  success_50: '#f6ffed',
  success_100: '#d9f7be',
  success_200: '#b7eb8f',
  success_300: '#95de64',
  success_400: '#73d13d',
  success_500: '#52c41a',   
  warning: '#faad14',
  info: '#1677ff',
} as const

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  pageX: 24,
  pageY: 32,
  sectionGap: 24,
  cardPadding: 24,
} as const

export const BORDERS = {
  width: 1,
  radiusXs: 6,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusPill: 999,
} as const

export const SHADOW = {
  card: '0 8px 24px rgba(20, 20, 20, 0.04)',
  dropdown: '0 12px 32px rgba(20, 20, 20, 0.08)',
} as const

export type FontToken = keyof typeof FONT
export type ColorToken = keyof typeof COLORS
export type SpacingToken = keyof typeof SPACING
export type BorderToken = keyof typeof BORDERS
export type ShadowToken = keyof typeof SHADOW

export const designTokens = {
  typography: FONT,
  colors: COLORS,
  spacing: SPACING,
  border: BORDERS,
  shadow: SHADOW,
} as const
