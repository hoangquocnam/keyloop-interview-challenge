import {
  ExclamationCircleOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Card, Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/app/routes.ts";
import { Button, Text, View } from "@/components/ui";
import { FormInput, FormInputPassword } from "@/components/ui/Input/index.ts";
import { loginSchema } from "@/validations/auth.ts";
import type { LoginFormValues } from "@/validations/auth.ts";
import {
  BORDERS,
  SHADOW,
  SPACING,
  FONT,
} from "@/theme/design-tokens.ts";
import { useRootStore } from "@/stores/use-root-store.ts";

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
        backgroundColor="white"
        justifyContent="center"
        minHeight="100vh"
        px="lg"
        py="xl"
      >
        <View maxWidth={560} width="100%">
          <View flexDirection="column" gap="xxl" width="100%">
            <View alignItems="center" flexDirection="column" gap="xxs">
              <Text
                as="h1"
                lineHeight={FONT.lineHeightHeading}
                m={0}
                variant="large"
                fontSize={48}
                weight={FONT.fontWeightBold}
              >
                LeadStream
              </Text>
              <Text
                as="span"
                color="textSecondary"
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
              <View flexDirection="column" gap="lg">
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
                    htmlType="submit"
                    block
                    borderRadius={BORDERS.radiusXs}
                    fontSize={FONT.fontSizeLg}
                    fontWeight={FONT.fontWeightBold}
                    loading={isSubmitting || auth.isLoggingIn}
                    mt="xs"
                    size="lg"
                    variant="primary"
                  >
                    Sign In
                  </Button>
                </View>

                <Divider style={{ margin: "8px 0 0" }} />

                <Text
                  as="span"
                  color="textSecondary"
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
