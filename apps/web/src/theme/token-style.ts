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
