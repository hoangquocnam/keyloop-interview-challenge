import type { CSSProperties } from "react";

import {
  BORDERS,
  COLORS,
  SHADOW,
  SPACING,
  type BorderToken,
  type ColorToken,
  type ShadowToken,
  type SpacingToken,
} from "./design-tokens.ts";

export type TokenSpacingValue = number | string | SpacingToken | undefined;
export type TokenColorValue = string | ColorToken | undefined;
export type TokenBorderValue = number | string | BorderToken | undefined;
export type TokenShadowValue = string | ShadowToken | undefined;

type TokenSpacingStyleProps = {
  columnGap?: TokenSpacingValue;
  gap?: TokenSpacingValue;
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
  rowGap?: TokenSpacingValue;
};

const hasOwnToken = <TToken extends string>(
  tokens: Record<TToken, number | string>,
  value: string,
): value is TToken => {
  return Object.prototype.hasOwnProperty.call(tokens, value);
};

export const resolveSpacingToken = (value: TokenSpacingValue) => {
  if (typeof value === "string" && hasOwnToken(SPACING, value)) {
    return SPACING[value];
  }

  return value;
};

export const resolveSpacingStyles = ({
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
}: TokenSpacingStyleProps): CSSProperties => {
  const resolvedStyles: CSSProperties = {};

  const resolvedColumnGap = resolveSpacingToken(columnGap);
  const resolvedGap = resolveSpacingToken(gap);
  const resolvedMargin = resolveSpacingToken(m);
  const resolvedMarginBottom = resolveSpacingToken(mb ?? my);
  const resolvedMarginLeft = resolveSpacingToken(ml ?? mx);
  const resolvedMarginRight = resolveSpacingToken(mr ?? mx);
  const resolvedMarginTop = resolveSpacingToken(mt ?? my);
  const resolvedPadding = resolveSpacingToken(p);
  const resolvedPaddingBottom = resolveSpacingToken(pb ?? py);
  const resolvedPaddingLeft = resolveSpacingToken(pl ?? px);
  const resolvedPaddingRight = resolveSpacingToken(pr ?? px);
  const resolvedPaddingTop = resolveSpacingToken(pt ?? py);
  const resolvedRowGap = resolveSpacingToken(rowGap);

  if (resolvedColumnGap !== undefined) {
    resolvedStyles.columnGap = resolvedColumnGap;
  }

  if (resolvedGap !== undefined) {
    resolvedStyles.gap = resolvedGap;
  }

  if (resolvedMargin !== undefined) {
    resolvedStyles.margin = resolvedMargin;
  }

  if (resolvedMarginBottom !== undefined) {
    resolvedStyles.marginBottom = resolvedMarginBottom;
  }

  if (resolvedMarginLeft !== undefined) {
    resolvedStyles.marginLeft = resolvedMarginLeft;
  }

  if (resolvedMarginRight !== undefined) {
    resolvedStyles.marginRight = resolvedMarginRight;
  }

  if (resolvedMarginTop !== undefined) {
    resolvedStyles.marginTop = resolvedMarginTop;
  }

  if (resolvedPadding !== undefined) {
    resolvedStyles.padding = resolvedPadding;
  }

  if (resolvedPaddingBottom !== undefined) {
    resolvedStyles.paddingBottom = resolvedPaddingBottom;
  }

  if (resolvedPaddingLeft !== undefined) {
    resolvedStyles.paddingLeft = resolvedPaddingLeft;
  }

  if (resolvedPaddingRight !== undefined) {
    resolvedStyles.paddingRight = resolvedPaddingRight;
  }

  if (resolvedPaddingTop !== undefined) {
    resolvedStyles.paddingTop = resolvedPaddingTop;
  }

  if (resolvedRowGap !== undefined) {
    resolvedStyles.rowGap = resolvedRowGap;
  }

  return resolvedStyles;
};

export const resolveColorToken = (value: TokenColorValue) => {
  if (typeof value === "string" && hasOwnToken(COLORS, value)) {
    return COLORS[value];
  }

  return value;
};

export const resolveBorderToken = (value: TokenBorderValue) => {
  if (typeof value === "string" && hasOwnToken(BORDERS, value)) {
    return BORDERS[value];
  }

  return value;
};

export const resolveShadowToken = (value: TokenShadowValue) => {
  if (typeof value === "string" && hasOwnToken(SHADOW, value)) {
    return SHADOW[value];
  }

  return value;
};
