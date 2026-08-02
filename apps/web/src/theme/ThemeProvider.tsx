import { App as AntdApp, ConfigProvider } from 'antd'
import type { PropsWithChildren } from 'react'
import { antdThemeConfig } from './antd-theme.ts'

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider theme={antdThemeConfig}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  )
}
