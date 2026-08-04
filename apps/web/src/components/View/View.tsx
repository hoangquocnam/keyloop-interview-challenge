import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

type ViewOwnProps<T extends ElementType = "div"> = {
  readonly alignItems?: CSSProperties["alignItems"];
  readonly as?: T;
  readonly backgroundColor?: CSSProperties["backgroundColor"];
  readonly borderColor?: CSSProperties["borderColor"];
  readonly borderRadius?: CSSProperties["borderRadius"];
  readonly borderBottomStyle?: CSSProperties["borderBottomStyle"];
  readonly borderBottomWidth?: CSSProperties["borderBottomWidth"];
  readonly borderRightStyle?: CSSProperties["borderRightStyle"];
  readonly borderRightWidth?: CSSProperties["borderRightWidth"];
  readonly borderStyle?: CSSProperties["borderStyle"];
  readonly borderTopStyle?: CSSProperties["borderTopStyle"];
  readonly borderTopWidth?: CSSProperties["borderTopWidth"];
  readonly borderWidth?: CSSProperties["borderWidth"];
  readonly bottom?: CSSProperties["bottom"];
  readonly boxShadow?: CSSProperties["boxShadow"];
  readonly children?: ReactNode;
  readonly className?: string;
  readonly columnGap?: CSSProperties["columnGap"];
  readonly display?: CSSProperties["display"];
  readonly flex?: CSSProperties["flex"];
  readonly flexBasis?: CSSProperties["flexBasis"];
  readonly flexDirection?: CSSProperties["flexDirection"];
  readonly flexGrow?: CSSProperties["flexGrow"];
  readonly flexShrink?: CSSProperties["flexShrink"];
  readonly flexWrap?: CSSProperties["flexWrap"];
  readonly gap?: CSSProperties["gap"];
  readonly height?: CSSProperties["height"];
  readonly justifyContent?: CSSProperties["justifyContent"];
  readonly left?: CSSProperties["left"];
  readonly m?: CSSProperties["margin"];
  readonly mb?: CSSProperties["marginBottom"];
  readonly ml?: CSSProperties["marginLeft"];
  readonly mr?: CSSProperties["marginRight"];
  readonly mt?: CSSProperties["marginTop"];
  readonly mx?: CSSProperties["marginLeft"];
  readonly my?: CSSProperties["marginTop"];
  readonly maxHeight?: CSSProperties["maxHeight"];
  readonly maxWidth?: CSSProperties["maxWidth"];
  readonly minHeight?: CSSProperties["minHeight"];
  readonly minWidth?: CSSProperties["minWidth"];
  readonly overflow?: CSSProperties["overflow"];
  readonly p?: CSSProperties["padding"];
  readonly pb?: CSSProperties["paddingBottom"];
  readonly pl?: CSSProperties["paddingLeft"];
  readonly pr?: CSSProperties["paddingRight"];
  readonly position?: CSSProperties["position"];
  readonly pt?: CSSProperties["paddingTop"];
  readonly px?: CSSProperties["paddingLeft"];
  readonly py?: CSSProperties["paddingTop"];
  readonly right?: CSSProperties["right"];
  readonly rowGap?: CSSProperties["rowGap"];
  readonly style?: CSSProperties;
  readonly top?: CSSProperties["top"];
  readonly width?: CSSProperties["width"];
};

type ViewProps<T extends ElementType = "div"> = ViewOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, 'children' | keyof ViewOwnProps>;

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
  bottom,
  boxShadow,
  children,
  className,
  columnGap,
  display,
  flex,
  flexBasis,
  flexDirection,
  flexGrow,
  flexShrink,
  flexWrap,
  gap,
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
        bottom,
        boxShadow,
        columnGap,
        display: resolvedDisplay,
        flex,
        flexBasis,
        flexDirection,
        flexGrow,
        flexShrink,
        flexWrap,
        gap,
        height,
        justifyContent,
        left,
        margin: m,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        marginRight: mr ?? mx,
        marginTop: mt ?? my,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        overflow,
        padding: p,
        paddingBottom: pb ?? py,
        paddingLeft: pl ?? px,
        paddingRight: pr ?? px,
        paddingTop: pt ?? py,
        position,
        right,
        rowGap,
        top,
        width,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};
