'use client'

import * as React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
  BookOpenIcon,
  CogIcon,
  FileSpreadsheetIcon,
  HandshakeIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  RocketIcon,
  RssIcon,
  SparklesIcon
} from 'lucide-react'

import { NavSite } from '@/components/nav-site'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton
} from '@/components/ui/sidebar'

export const navigation = {
  main: [
    {
      icon: LayoutDashboardIcon,
      title: 'Dashboard',
      url: '/dashboard'
    },
    {
      icon: FileSpreadsheetIcon,
      title: 'Expenses',
      url: '/expenses'
    },
    {
      icon: SparklesIcon,
      items: [
        { disabled: true, title: 'Copilot', url: '/ai/copilot' },
        { disabled: true, title: 'Smart Scan', url: '/ai/smart-scan' }
      ],
      title: 'AI Suite',
      url: '/ai'
    },
    {
      icon: CogIcon,
      title: 'Settings',
      url: '/settings'
    }
  ],
  resources: [
    {
      disabled: true,
      icon: RocketIcon,
      title: 'Release notes',
      url: '/release-notes'
    },
    {
      disabled: true,
      icon: RssIcon,
      title: 'Blog',
      url: '/blog'
    },
    {
      icon: BookOpenIcon,
      items: [
        { disabled: true, title: 'Introduction', url: '/resources/api' },
        {
          disabled: true,
          title: 'Authentication',
          url: '/resources/api/authentication'
        },
        { disabled: true, title: 'Users', url: '/resources/api/users' },
        {
          disabled: true,
          title: 'Expenses',
          url: '/resources/api/expenses'
        },
        { disabled: true, title: 'Errors', url: '/resources/api/errors' },
        { disabled: true, title: 'Events', url: '/resources/api/events' }
      ],
      title: 'Documentation',
      url: '/resources'
    },
    {
      icon: HandshakeIcon,
      title: 'Terms and policies',
      url: '/policies'
    }
  ]
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          className="group-data-[collapsible=icon]:pl-0! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          size="lg"
        >
          <Link href="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ReceiptTextIcon className="size-4" />
            </div>
            <div className="text-base leading-tight font-semibold">
              Expender
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavSite items={navigation.main} />
        <NavSite items={navigation.resources} label="Resources" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
