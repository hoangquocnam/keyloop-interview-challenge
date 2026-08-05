import { Input } from "antd";
import type { InputProps } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";
import {
  BORDERS,
  COLORS,
  SPACING,
} from "@/theme/design-tokens.ts";
import { Text } from "../Text/index.ts";
import { View } from "../View/index.ts";

export type BaseFormInputProps<TFieldValues extends FieldValues> = {
  readonly autoComplete?: string;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly labelAction?: ReactNode;
  readonly name: Path<TFieldValues>;
  readonly onValueChange?: () => void;
  readonly placeholder?: string;
  readonly prefix?: ReactNode;
  readonly style?: CSSProperties;
  readonly text?: ReactNode;
};

type FormInputProps<TFieldValues extends FieldValues> =
  BaseFormInputProps<TFieldValues> &
    Omit<
      InputProps,
      | "className"
      | "defaultValue"
      | "disabled"
      | "id"
      | "name"
      | "prefix"
      | "size"
    >;

export const FormInput = <TFieldValues extends FieldValues>({
  autoComplete,
  disabled,
  id,
  labelAction,
  name,
  onValueChange,
  placeholder,
  prefix,
  style,
  text,
  ...restProps
}: FormInputProps<TFieldValues>) => {
  const { control: formControl } = useFormContext();
  return (
    <View flexDirection="column" gap={SPACING.xs} style={style}>
      {text ? (
        <View
          alignItems={labelAction ? "center" : undefined}
          flexDirection={labelAction ? "row" : "column"}
          gap={'sm'}
          justifyContent={labelAction ? "space-between" : undefined}
          mb={labelAction ? SPACING.sm : undefined}
        >
          <label htmlFor={id}>
            <Text as="span" color={COLORS.gray900} variant="large">
              {text}
            </Text>
          </label>
          {labelAction}
        </View>
      ) : null}

      <Controller
        control={formControl}
        name={name}
        render={({ field, fieldState }) => {
          const sharedProps = {
            ...field,
            autoComplete,
            disabled,
            id,
            placeholder,
            prefix,
            ...restProps,
            size: "large" as const,
            status: fieldState.error ? "error" : undefined,
          };

          return (
            <View>
              <Input
                {...sharedProps}
                onChange={(event) => {
                  onValueChange?.();
                  field.onChange(event);
                }}
                status={fieldState.error ? "error" : undefined}
                style={{
                  borderRadius: BORDERS.radiusSm,
                  height: 48,
                }}
              />

              {fieldState.error?.message ? (
                <Text
                  as="span"
                  color={COLORS.error}
                  mt={SPACING.xs}
                  variant="small"
                >
                  {fieldState.error.message}
                </Text>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
};
