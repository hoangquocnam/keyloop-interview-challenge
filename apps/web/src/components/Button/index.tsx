import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { BORDERS, COLORS, FONT } from "../../theme/design-tokens.ts";

type ButtonVariant = "primary" | "outline" | "link";

type SharedButtonProps = {
  readonly alignItems?: CSSProperties["alignItems"];
  readonly display?: CSSProperties["display"];
  readonly height?: CSSProperties["height"];
  readonly justifyContent?: CSSProperties["justifyContent"];
  readonly m?: CSSProperties["margin"];
  readonly mb?: CSSProperties["marginBottom"];
  readonly ml?: CSSProperties["marginLeft"];
  readonly mr?: CSSProperties["marginRight"];
  readonly mt?: CSSProperties["marginTop"];
  readonly mx?: CSSProperties["marginLeft"];
  readonly my?: CSSProperties["marginTop"];
  readonly p?: CSSProperties["padding"];
  readonly pb?: CSSProperties["paddingBottom"];
  readonly pl?: CSSProperties["paddingLeft"];
  readonly pr?: CSSProperties["paddingRight"];
  readonly pt?: CSSProperties["paddingTop"];
  readonly px?: CSSProperties["paddingLeft"];
  readonly py?: CSSProperties["paddingTop"];
  readonly text?: ReactNode;
  readonly variant?: ButtonVariant;
  readonly width?: CSSProperties["width"];
};

type ButtonProps = SharedButtonProps &
  Omit<AntButtonProps, "children" | "type" | "variant"> & {
    readonly children?: ReactNode;
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

export const Button = ({
  alignItems,
  children,
  display,
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
  style,
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
        alignItems,
        borderRadius: BORDERS.radiusXs,
        display,
        fontSize: FONT.fontSizeMd,
        fontWeight: FONT.fontWeightSemibold,
        height,
        justifyContent,
        margin: m,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        marginRight: mr ?? mx,
        marginTop: mt ?? my,
        padding: p,
        paddingBottom: pb ?? py,
        paddingLeft: pl ?? px,
        paddingRight: pr ?? px,
        paddingTop: pt ?? py,
        width,
        ...style,
      }}
    >
      {content}
    </AntButton>
  );
};
