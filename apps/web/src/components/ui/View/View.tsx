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
  resolveSpacingStyles,
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
  const resolvedBorderColor = resolveColorToken(borderColor);
  const resolvedBorderRadius = resolveBorderToken(borderRadius);
  const resolvedBoxShadow = resolveShadowToken(boxShadow);
  const resolvedFlex =
    typeof flex === "number" ? `${flex} 1 0%` : flex;

  return (
    <Component
      {...restProps}
      className={className}
      style={{
        alignItems,
        backgroundColor: resolveColorToken(backgroundColor),
        ...(resolvedBorderColor !== undefined
          ? { borderColor: resolvedBorderColor }
          : {}),
        ...(resolvedBorderRadius !== undefined
          ? { borderRadius: resolvedBorderRadius }
          : {}),
        ...(borderBottomStyle !== undefined ? { borderBottomStyle } : {}),
        ...(borderBottomWidth !== undefined ? { borderBottomWidth } : {}),
        ...(borderRightStyle !== undefined ? { borderRightStyle } : {}),
        ...(borderRightWidth !== undefined ? { borderRightWidth } : {}),
        ...(borderStyle !== undefined ? { borderStyle } : {}),
        ...(borderTopStyle !== undefined ? { borderTopStyle } : {}),
        ...(borderTopWidth !== undefined ? { borderTopWidth } : {}),
        ...(borderWidth !== undefined ? { borderWidth } : {}),
        ...(border !== undefined ? { border } : {}),
        bottom,
        ...(resolvedBoxShadow !== undefined ? { boxShadow: resolvedBoxShadow } : {}),
        cursor,
        display: resolvedDisplay,
        ...(resolvedFlex !== undefined ? { flex: resolvedFlex } : {}),
        flexBasis,
        flexDirection,
        flexGrow,
        flexShrink,
        flexWrap,
        gridTemplateColumns,
        gridTemplateRows,
        height,
        justifyContent,
        left,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        overflow,
        position,
        right,
        top,
        width,
        ...resolveSpacingStyles({
          columnGap,
          gap,
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
          rowGap,
        }),
        ...style,
      }}
    >
      {children}
    </Component>
  );
};
