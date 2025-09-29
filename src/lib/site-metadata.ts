import {
  AtSignIcon,
  CloudDownloadIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileSpreadsheetIcon
} from 'lucide-react'

import { GitHubIcon } from '@/components/ui/icons'

export const marketingNav = [
  { title: 'About', href: '/about' },
  { title: 'Pricing', href: '/pricing' },
  { title: 'Blog', href: '/blog' },
  { title: 'Changelog', href: '/changelog' }
] as const

export const footerItems = {
  product: [
    { name: 'Why Expender', href: '/#why' },
    { name: 'Pricing', href: '/pricing' },
    { name: "What's new", href: '/changelog' }
  ],
  support: [
    { name: 'Submit ticket', href: '/support' },
    { name: 'Guides', href: '/guides' }
  ],
  resources: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' }
  ],
  legal: [
    { name: 'Terms of service', href: '/terms' },
    { name: 'Privacy policy', href: '/privacy' },
    {
      name: 'License',
      href: 'https://github.com/george-swift/expender/blob/master/LICENSE.md'
    }
  ],
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com/george-swift/expender',
      icon: GitHubIcon
    },
    { name: 'Mail', href: 'mailto:support@expender.app', icon: AtSignIcon }
  ]
} as const

export const secondaryFeatures = [
  {
    icon: DatabaseIcon,
    title: 'Effortless Data Entry',
    description:
      'Batch operations and SmartScan eliminate tedious expense logging.'
  },
  {
    icon: FileSpreadsheetIcon,
    title: 'Business-Ready Reports',
    description:
      'Export detailed CSV reports with customizable fields for accounting.'
  },
  {
    icon: CloudDownloadIcon,
    title: 'Cloud-Based Access',
    description:
      'Secure, responsive web app accessible from any device, anywhere.'
  },
  {
    icon: CreditCardIcon,
    title: 'Flexible Pricing',
    description:
      'Free tier with 30 monthly scans, Pro tier for unlimited usage.'
  }
] as const

export type MarketingNavItem = (typeof marketingNav)[number]
