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
    { name: 'Why Expender', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: "What's new", href: '/changelog' }
  ],
  solutions: [
    { name: 'By product', href: '/#product' },
    { name: 'For individuals', href: '/individuals' },
    { name: 'For businesses', href: '/business' }
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Customer center', href: '/contact' },
    { name: 'Guides', href: '/guides' }
  ],
  legal: [
    { name: 'About', href: '/about' },
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' }
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
