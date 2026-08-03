import {
  ExclamationCircleOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Card, Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../../app/routes.ts";
import { FormInput, FormInputPassword } from "../../components/Input/index.ts";
import { Text } from "../../components/Text/index.ts";
import { View } from "../../components/View/index.ts";
import { loginSchema } from "../../constants/validations/auth.ts";
import type { LoginFormValues } from "../../constants/validations/auth.ts";
import {
  BORDERS,
  COLORS,
  SHADOW,
  SPACING,
  FONT,
} from "../../theme/design-tokens.ts";
import { useRootStore } from "../../stores/use-root-store.ts";

export const LoginPage = observer(() => {
  const navigate = useNavigate();
  const { auth } = useRootStore();
  const [credentialErrorMessage, setCredentialErrorMessage] = useState<
    string | null
  >(null);
  const method = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onSubmit",
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = method;

  const onSubmit = handleSubmit(async (values) => {
    try {
      setCredentialErrorMessage(null);
      await auth.login(values);
      void navigate(appRoutes.leads);
    } catch (error) {
      setCredentialErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    }
  });

  return (
    <FormProvider {...method}>
      <View
        as="main"
        alignItems="center"
        backgroundColor={COLORS.white}
        justifyContent="center"
        minHeight="100vh"
        px={SPACING.lg}
        py={SPACING.xl}
      >
        <View maxWidth={560} width="100%">
          <View flexDirection="column" gap={SPACING.xxl} width="100%">
            <View alignItems="center" flexDirection="column" gap={SPACING.xxs}>
              <Text
                as="h1"
                m={0}
                variant="large"
                fontSize={48}
                weight={FONT.fontWeightBold}
                style={{
                  lineHeight: FONT.lineHeightHeading,
                }}
              >
                LeadStream
              </Text>
              <Text
                as="span"
                color={COLORS.textSecondary}
                fontSize={FONT.fontSizeXl}
                textAlign="center"
                variant="large"
              >
                Sales Portal
              </Text>
            </View>

            <Card
              styles={{
                body: {
                  padding: 40,
                },
              }}
              style={{
                borderRadius: 14,
                boxShadow: SHADOW.card,
                width: "100%",
              }}
            >
              <View flexDirection="column" gap={SPACING.lg}>
                {credentialErrorMessage ? (
                  <Alert
                    description={null}
                    icon={<ExclamationCircleOutlined />}
                    showIcon
                    style={{
                      borderRadius: BORDERS.radiusSm,
                    }}
                    title={credentialErrorMessage}
                    type="error"
                  />
                ) : null}

                <View as="form" onSubmit={onSubmit}>
                  <FormInput<LoginFormValues>
                    autoComplete="email"
                    id="login-email"
                    name="email"
                    onValueChange={() => setCredentialErrorMessage(null)}
                    placeholder="Enter your email"
                    prefix={<MailOutlined />}
                    style={{ marginBottom: SPACING.lg }}
                    text="Email Address"
                  />

                  <FormInputPassword<LoginFormValues>
                    autoComplete="current-password"
                    id="login-password"
                    name="password"
                    onValueChange={() => setCredentialErrorMessage(null)}
                    placeholder="Enter your password"
                    prefix={<LockOutlined />}
                    style={{ marginBottom: SPACING.lg }}
                    text="Password"
                  />

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isSubmitting || auth.isLoggingIn}
                    style={{
                      borderRadius: BORDERS.radiusXs,
                      fontSize: FONT.fontSizeLg,
                      fontWeight: FONT.fontWeightBold,
                      height: 44,
                      marginTop: SPACING.xs,
                    }}
                  >
                    Sign In
                  </Button>
                </View>

                <Divider style={{ margin: "8px 0 0" }} />

                <Text
                  as="span"
                  color={COLORS.textSecondary}
                  fontSize={FONT.fontSizeLg}
                  textAlign="center"
                >
                  Demo Account: admin@leadstream.com
                </Text>
              </View>
            </Card>
          </View>
        </View>
      </View>
    </FormProvider>
  );
});
