import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { BORDERS, COLORS, FONT, SPACING } from "../../theme/design-tokens.ts";
import {
  type TokenBorderValue,
  type TokenColorValue,
  type TokenSpacingValue,
  resolveBorderToken,
  resolveColorToken,
  resolveSpacingToken,
} from "../../theme/token-style.ts";

type ButtonVariant = "primary" | "outline" | "link";
type ButtonSize = "sm" | "md" | "lg";

type SharedButtonProps = {
  alignItems?: CSSProperties["alignItems"];
  backgroundColor?: TokenColorValue;
  borderColor?: TokenColorValue;
  borderRadius?: TokenBorderValue;
  textColor?: TokenColorValue;
  display?: CSSProperties["display"];
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  height?: CSSProperties["height"];
  justifyContent?: CSSProperties["justifyContent"];
  m?: TokenSpacingValue;
  mb?: TokenSpacingValue;
  ml?: TokenSpacingValue;
  mr?: TokenSpacingValue;
  mt?: TokenSpacingValue;
  mx?: TokenSpacingValue;
  my?: TokenSpacingValue;
  p?: TokenSpacingValue;
  pb?: TokenSpacingValue;
  pl?: TokenSpacingValue;
  pr?: TokenSpacingValue;
  pt?: TokenSpacingValue;
  px?: TokenSpacingValue;
  py?: TokenSpacingValue;
  size?: ButtonSize;
  text?: ReactNode;
  variant?: ButtonVariant;
  width?: CSSProperties["width"];
};

type ButtonProps = SharedButtonProps &
  Omit<AntButtonProps, "children" | "color" | "size" | "type" | "variant"> & {
    children?: ReactNode;
  };

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  link: {
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
    color: COLORS.text,
    paddingInline: 0,
  },
  outline: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    boxShadow: "none",
    color: COLORS.text,
  },
  primary: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
    boxShadow: "none",
    color: COLORS.white,
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: {
    fontSize: FONT.fontSizeSm,
    height: 32,
    paddingInline: SPACING.sm,
  },
  md: {
    fontSize: FONT.fontSizeMd,
    height: 36,
    paddingInline: SPACING.md,
  },
  lg: {
    fontSize: FONT.fontSizeMd,
    height: 44,
    paddingInline: SPACING.lg,
  },
};

export const Button = ({
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  children,
  display,
  fontSize,
  fontWeight,
  height,
  justifyContent,
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
  size = "md",
  style,
  textColor,
  text,
  variant = "outline",
  width,
  ...restProps
}: ButtonProps) => {
  const content = text ?? children;

  return (
    <AntButton
      {...restProps}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        alignItems,
        backgroundColor: resolveColorToken(backgroundColor) ?? variantStyles[variant].backgroundColor,
        borderColor: resolveColorToken(borderColor) ?? variantStyles[variant].borderColor,
        borderRadius: resolveBorderToken(borderRadius) ?? BORDERS.radiusXs,
        color: resolveColorToken(textColor) ?? variantStyles[variant].color,
        display,
        fontSize: fontSize ?? sizeStyles[size].fontSize,
        fontWeight: fontWeight ?? FONT.fontWeightSemibold,
        height: height ?? sizeStyles[size].height,
        justifyContent,
        margin: resolveSpacingToken(m),
        marginBottom: resolveSpacingToken(mb ?? my),
        marginLeft: resolveSpacingToken(ml ?? mx),
        marginRight: resolveSpacingToken(mr ?? mx),
        marginTop: resolveSpacingToken(mt ?? my),
        padding: resolveSpacingToken(p),
        paddingBottom: resolveSpacingToken(pb ?? py),
        paddingLeft: resolveSpacingToken(pl ?? px),
        paddingRight: resolveSpacingToken(pr ?? px),
        paddingTop: resolveSpacingToken(pt ?? py),
        width,
        ...style,
      }}
    >
      {content}
    </AntButton>
  );
};
