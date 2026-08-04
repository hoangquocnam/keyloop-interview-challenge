import { appRoutes } from '../app/routes.ts'

export const demoCredentials = {
  email: 'admin@leadstream.com',
  password: 'Password123!',
} as const

export type ShellNavigationKey = 'dashboard' | 'leads'

export type ShellNavigationItem = {
  readonly key: ShellNavigationKey
  readonly label: string
  readonly path: string
}

export const shellNavigationItems: readonly ShellNavigationItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: appRoutes.dashboard,
  },
  {
    key: 'leads',
    label: 'Leads',
    path: appRoutes.leads,
  },
]

export const shellFooterLinks = [
  {
    key: 'settings',
    label: 'Settings',
  },
  {
    key: 'support',
    label: 'Support',
  },
] as const

export const shellTopbarContent = {
  newLeadLabel: 'New Lead',
  searchPlaceholder: 'Search leads by name, email, or phone...',
} as const

export const dashboardPageContent = {
  description:
    'This tab is ready for the dashboard widgets once you want to define the analytics layout.',
  title: 'Dashboard',
} as const

export type LeadStatusTone = 'neutral' | 'info' | 'success'

export type LeadInboxRow = {
  readonly assignedTo:
    | {
        readonly fullName: string
        readonly initials: string
      }
    | null
  readonly contactEmail: string
  readonly customerName: string
  readonly hasUnreadIndicator: boolean
  readonly id: string
  readonly isSelected: boolean
  readonly lastActivity: string
  readonly phone: string
  readonly source: string
  readonly statusLabel: string
  readonly statusTone: LeadStatusTone
}

export const leadInboxContent = {
  filters: [
    {
      key: 'status',
      label: 'Status: All',
    },
    {
      key: 'source',
      label: 'Source: All',
    },
    {
      key: 'more-filters',
      label: 'More Filters',
    },
  ],
  pagination: {
    currentPage: 1,
    pages: [1, 2, 3],
    summaryLabel: 'Showing 1 to 4 of 142 entries',
  },
  summary: '142 total leads requiring attention',
  title: 'Leads Inbox',
} as const

export const leadInboxRows: readonly LeadInboxRow[] = [
  {
    assignedTo: {
      fullName: 'Jim Halpert',
      initials: 'JH',
    },
    contactEmail: 'm.scott@dundermifflin.com',
    customerName: 'Michael Scott',
    hasUnreadIndicator: true,
    id: 'lead-michael-scott',
    isSelected: true,
    lastActivity: 'Submitted 10m ago',
    phone: '(555) 123-4567',
    source: 'Website Form',
    statusLabel: 'NEW',
    statusTone: 'neutral',
  },
  {
    assignedTo: {
      fullName: 'Dwight Schrute',
      initials: 'DS',
    },
    contactEmail: 's.connor@sky.net',
    customerName: 'Sarah Connor',
    hasUnreadIndicator: false,
    id: 'lead-sarah-connor',
    isSelected: false,
    lastActivity: 'Call logged 2h ago',
    phone: '(555) 987-6543',
    source: 'Phone Inbound',
    statusLabel: 'CONTACTED',
    statusTone: 'info',
  },
  {
    assignedTo: {
      fullName: 'Pam Beesly',
      initials: 'PB',
    },
    contactEmail: 'b.wayne@wayneent.com',
    customerName: 'Bruce Wayne',
    hasUnreadIndicator: false,
    id: 'lead-bruce-wayne',
    isSelected: false,
    lastActivity: 'Quote sent 1d ago',
    phone: '--',
    source: 'Walk-in',
    statusLabel: 'QUALIFIED',
    statusTone: 'success',
  },
  {
    assignedTo: null,
    contactEmail: 'a.dent@hitchhiker.org',
    customerName: 'Arthur Dent',
    hasUnreadIndicator: true,
    id: 'lead-arthur-dent',
    isSelected: false,
    lastActivity: 'Submitted 3h ago',
    phone: '(555) 424-2424',
    source: 'Website Form',
    statusLabel: 'NEW',
    statusTone: 'neutral',
  },
] as const
