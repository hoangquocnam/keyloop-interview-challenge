import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import {
  type TokenBorderValue,
  type TokenColorValue,
  type TokenShadowValue,
  type TokenSpacingValue,
  resolveBorderToken,
  resolveColorToken,
  resolveShadowToken,
  resolveSpacingToken,
} from "@/theme/token-style.ts";

type ViewOwnProps<T extends ElementType = "div"> = {
  alignItems?: CSSProperties["alignItems"];
  as?: T;
  backgroundColor?: TokenColorValue;
  borderColor?: TokenColorValue;
  borderRadius?: TokenBorderValue;
  borderBottomStyle?: CSSProperties["borderBottomStyle"];
  borderBottomWidth?: CSSProperties["borderBottomWidth"];
  borderRightStyle?: CSSProperties["borderRightStyle"];
  borderRightWidth?: CSSProperties["borderRightWidth"];
  borderStyle?: CSSProperties["borderStyle"];
  borderTopStyle?: CSSProperties["borderTopStyle"];
  borderTopWidth?: CSSProperties["borderTopWidth"];
  borderWidth?: CSSProperties["borderWidth"];
  border?: CSSProperties["border"];
  bottom?: CSSProperties["bottom"];
  boxShadow?: TokenShadowValue;
  children?: ReactNode;
  className?: string;
  columnGap?: TokenSpacingValue;
  cursor?: CSSProperties["cursor"];
  display?: CSSProperties["display"];
  flex?: CSSProperties["flex"];
  flexBasis?: CSSProperties["flexBasis"];
  flexDirection?: CSSProperties["flexDirection"];
  flexGrow?: CSSProperties["flexGrow"];
  flexShrink?: CSSProperties["flexShrink"];
  flexWrap?: CSSProperties["flexWrap"];
  gap?: TokenSpacingValue;
  gridTemplateColumns?: CSSProperties["gridTemplateColumns"];
  gridTemplateRows?: CSSProperties["gridTemplateRows"];
  height?: CSSProperties["height"];
  justifyContent?: CSSProperties["justifyContent"];
  left?: CSSProperties["left"];
  m?: TokenSpacingValue;
  mb?: TokenSpacingValue;
  ml?: TokenSpacingValue;
  mr?: TokenSpacingValue;
  mt?: TokenSpacingValue;
  mx?: TokenSpacingValue;
  my?: TokenSpacingValue;
  maxHeight?: CSSProperties["maxHeight"];
  maxWidth?: CSSProperties["maxWidth"];
  minHeight?: CSSProperties["minHeight"];
  minWidth?: CSSProperties["minWidth"];
  overflow?: CSSProperties["overflow"];
  p?: TokenSpacingValue;
  pb?: TokenSpacingValue;
  pl?: TokenSpacingValue;
  pr?: TokenSpacingValue;
  position?: CSSProperties["position"];
  pt?: TokenSpacingValue;
  px?: TokenSpacingValue;
  py?: TokenSpacingValue;
  right?: CSSProperties["right"];
  rowGap?: TokenSpacingValue;
  style?: CSSProperties;
  top?: CSSProperties["top"];
  width?: CSSProperties["width"];
};

type ViewProps<T extends ElementType = "div"> = ViewOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, "children" | keyof ViewOwnProps | "gap">;

export const View = <T extends ElementType = "div">({
  alignItems,
  as,
  backgroundColor,
  borderColor,
  borderRadius,
  borderBottomStyle,
  borderBottomWidth,
  borderRightStyle,
  borderRightWidth,
  borderStyle,
  borderTopStyle,
  borderTopWidth,
  borderWidth,
  border,
  bottom,
  boxShadow,
  children,
  className,
  columnGap,
  cursor,
  display,
  flex,
  flexBasis,
  flexDirection,
  flexGrow,
  flexShrink,
  flexWrap,
  gap,
  gridTemplateColumns,
  gridTemplateRows,
  height,
  justifyContent,
  left,
  m,
  mb,
  ml,
  mr,
  mt,
  mx,
  my,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  overflow,
  p,
  pb,
  pl,
  pr,
  position,
  pt,
  px,
  py,
  right,
  rowGap,
  style,
  top,
  width,
  ...restProps
}: ViewProps<T>) => {
  const Component = as ?? "div";
  const resolvedDisplay =
    display ??
    (alignItems != null ||
    justifyContent != null ||
    gap != null ||
    rowGap != null ||
    columnGap != null ||
    flexDirection != null ||
    flexWrap != null
      ? "flex"
      : undefined);

  return (
    <Component
      {...restProps}
      className={className}
      style={{
        alignItems,
        backgroundColor: resolveColorToken(backgroundColor),
        borderColor: resolveColorToken(borderColor),
        borderRadius: resolveBorderToken(borderRadius),
        borderBottomStyle,
        borderBottomWidth,
        borderRightStyle,
        borderRightWidth,
        borderStyle,
        borderTopStyle,
        borderTopWidth,
        borderWidth,
        border,
        bottom,
        boxShadow: resolveShadowToken(boxShadow),
        cursor,
        display: resolvedDisplay,
        flex,
        flexBasis,
        flexDirection,
        flexGrow,
        flexShrink,
        flexWrap,
        gap: resolveSpacingToken(gap),
        gridTemplateColumns,
        gridTemplateRows,
        height,
        justifyContent,
        left,
        margin: resolveSpacingToken(m),
        marginBottom: resolveSpacingToken(mb ?? my),
        marginLeft: resolveSpacingToken(ml ?? mx),
        marginRight: resolveSpacingToken(mr ?? mx),
        marginTop: resolveSpacingToken(mt ?? my),
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        overflow,
        padding: resolveSpacingToken(p),
        paddingBottom: resolveSpacingToken(pb ?? py),
        paddingLeft: resolveSpacingToken(pl ?? px),
        paddingRight: resolveSpacingToken(pr ?? px),
        paddingTop: resolveSpacingToken(pt ?? py),
        position,
        right,
        top,
        width,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};
