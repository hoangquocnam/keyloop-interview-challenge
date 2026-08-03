import type { CSSProperties, ElementType, ReactNode } from 'react'
import { FONT } from '../../theme/design-tokens.ts'

type TextVariant = 'small' | 'medium' | 'large'

type TextProps = {
  readonly as?: ElementType
  readonly children: ReactNode
  readonly className?: string
  readonly color?: CSSProperties['color']
  readonly fontSize?: CSSProperties['fontSize']
  readonly height?: CSSProperties['height']
  readonly m?: CSSProperties['margin']
  readonly mb?: CSSProperties['marginBottom']
  readonly ml?: CSSProperties['marginLeft']
  readonly mr?: CSSProperties['marginRight']
  readonly mt?: CSSProperties['marginTop']
  readonly p?: CSSProperties['padding']
  readonly style?: CSSProperties
  readonly textAlign?: CSSProperties['textAlign']
  readonly variant?: TextVariant
  readonly weight?: CSSProperties['fontWeight']
  readonly width?: CSSProperties['width']
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
  m,
  mb,
  ml,
  mr,
  mt,
  p,
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
        color,
        fontSize,
        fontFamily: FONT.fontFamily,
        height,
        margin: m,
        marginBottom: mb,
        marginLeft: ml,
        marginRight: mr,
        marginTop: mt,
        padding: p,
        textAlign,
        width,
        fontWeight: weight ?? variantStyles[variant].fontWeight,
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
