import { Input } from "antd";
import type { CSSProperties } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import {
  BORDERS,
  COLORS,
  SPACING,
} from "../../theme/design-tokens.ts";
import { Text } from "../Text/index.ts";
import { View } from "../View/index.ts";
import type { BaseFormInputProps } from "./FormInput.tsx";
import type { PasswordProps } from "antd/es/input/Password";

type FormInputPasswordProps<TFieldValues extends FieldValues> =
  BaseFormInputProps<TFieldValues> &
    Omit<
      PasswordProps,
      | "className"
      | "defaultValue"
      | "disabled"
      | "id"
      | "name"
      | "prefix"
      | "size"
    >;

export const FormInputPassword = <TFieldValues extends FieldValues>({
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
}: FormInputPasswordProps<TFieldValues>) => {
  const { control } = useFormContext();
  return (
    <View flexDirection="column" gap={SPACING.xs} style={style}>
      {text ? (
        <View
          alignItems={labelAction ? "center" : undefined}
          flexDirection={labelAction ? "row" : "column"}
          gap={labelAction ? SPACING.sm : SPACING.xs}
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
        control={control}
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
            <>
              <Input.Password
                {...sharedProps}
                iconRender={() => null}
                onChange={(event) => {
                  onValueChange?.();
                  field.onChange(event);
                }}
                status={fieldState.error ? "error" : undefined}
                style={
                  {
                    borderRadius: BORDERS.radiusSm,
                    height: 48,
                  } as CSSProperties
                }
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
            </>
          );
        }}
      />
    </View>
  );
};
