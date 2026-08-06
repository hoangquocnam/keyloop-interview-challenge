import type { CSSProperties, ElementType, ReactNode } from 'react'
import { FONT } from '@/theme/design-tokens.ts'
import {
  type TokenColorValue,
  type TokenSpacingValue,
  resolveColorToken,
  resolveSpacingStyles,
} from '@/theme/token-style.ts'

type TextVariant = 'small' | 'medium' | 'large'

type TextProps = {
  as?: ElementType
  children: ReactNode
  className?: string
  color?: TokenColorValue
  fontSize?: CSSProperties['fontSize']
  height?: CSSProperties['height']
  letterSpacing?: CSSProperties['letterSpacing']
  lineHeight?: CSSProperties['lineHeight']
  m?: TokenSpacingValue
  mb?: TokenSpacingValue
  ml?: TokenSpacingValue
  mr?: TokenSpacingValue
  mt?: TokenSpacingValue
  mx?: TokenSpacingValue
  my?: TokenSpacingValue
  p?: TokenSpacingValue
  pb?: TokenSpacingValue
  pl?: TokenSpacingValue
  pr?: TokenSpacingValue
  pt?: TokenSpacingValue
  px?: TokenSpacingValue
  py?: TokenSpacingValue
  style?: CSSProperties
  textAlign?: CSSProperties['textAlign']
  variant?: TextVariant
  weight?: CSSProperties['fontWeight']
  width?: CSSProperties['width']
}

const variantStyles: Record<TextVariant, CSSProperties> = {
  small: {
    fontSize: FONT.fontSizeSm,
    lineHeight: FONT.lineHeight,
    fontWeight: FONT.fontWeightRegular,
  },
  medium: {
    fontSize: FONT.fontSizeMd,
    lineHeight: FONT.lineHeight,
    fontWeight: FONT.fontWeightMedium,
  },
  large: {
    fontSize: FONT.fontSizeLg,
    lineHeight: FONT.lineHeightHeading,
    fontWeight: FONT.fontWeightSemibold,
  },
}

export const Text = ({
  as: Component = 'span',
  children,
  className,
  color,
  fontSize,
  height,
  letterSpacing,
  lineHeight,
  m,
  mb,
  ml,
  mr,
  mt,
  mx,
  my,
  p,
  pb,
  pl,
  pr,
  pt,
  px,
  py,
  style,
  textAlign,
  variant = 'medium',
  weight,
  width,
}: TextProps) => {
  return (
    <Component
      className={className}
      style={{
        ...variantStyles[variant],
        color: resolveColorToken(color),
        fontSize,
        fontFamily: FONT.fontFamily,
        height,
        letterSpacing,
        lineHeight: lineHeight ?? variantStyles[variant].lineHeight,
        textAlign,
        width,
        fontWeight: weight ?? variantStyles[variant].fontWeight,
        ...resolveSpacingStyles({
          m,
          mb,
          ml,
          mr,
          mt,
          mx,
          my,
          p,
          pb,
          pl,
          pr,
          pt,
          px,
          py,
        }),
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
