'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
  CogIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  SparklesIcon
} from 'lucide-react'

import { Quota } from '@/types/quotas'

import { FREE_PLAN_SMART_SCAN_LIMIT } from '@/lib/utils'
import { NavSite } from '@/components/nav-site'
import { NavUser } from '@/components/nav-user'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton
} from '@/components/ui/sidebar'

const navigation = {
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
        {
          disabled: true,
          emoji: '🧾',
          title: 'Smart Scan',
          url: '/ai/smart-scan'
        },
        {
          disabled: true,
          emoji: '🤖',
          title: 'Copilot',
          url: '/ai/copilot'
        }
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
      emoji: '📝',
      title: 'Blog',
      url: '/blog'
    },
    {
      emoji: '💡',
      items: [
        {
          disabled: true,
          emoji: '📋',
          title: 'Getting Started',
          url: '/help/getting-started'
        },
        {
          disabled: true,
          emoji: '🧾',
          title: 'Smart Scan Guide',
          url: '/help/smart-scan'
        },
        {
          disabled: true,
          emoji: '📊',
          title: 'Exporting Data',
          url: '/help/exports'
        },
        {
          disabled: true,
          emoji: '🛠️',
          title: 'Troubleshooting',
          url: '/help/troubleshooting'
        },
        {
          disabled: true,
          emoji: '⌨️',
          title: 'Keyboard Shortcuts',
          url: '/help/shortcuts'
        }
      ],
      title: 'Help Center',
      url: '/help'
    },
    {
      disabled: true,
      emoji: '🚀',
      title: 'Release Notes',
      url: '/release-notes'
    },
    {
      emoji: '🖇️',
      title: 'Terms & Policies',
      url: '/policies'
    }
  ]
}

export function AppSidebar({
  quota,
  ...props
}: { quota: Quota } & React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  const quotaLimit = quota?.limit ?? FREE_PLAN_SMART_SCAN_LIMIT

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
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Expender</span>
              {!!quota?.plan && (
                <span className="truncate text-xs capitalize">
                  {quota.plan}
                </span>
              )}
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavSite items={navigation.main} />
        <NavSite items={navigation.resources} label="Resources" />
      </SidebarContent>
      <SidebarFooter>
        <Card className="gap-2 py-4 shadow-none">
          <CardHeader className="px-4">
            <CardTitle className="text-sm">Smart Scan Usage</CardTitle>
            <CardDescription>
              {quota?.used ?? 0} of {quotaLimit} scans used this month
            </CardDescription>
            <Progress value={((quota?.used ?? 0) / quotaLimit) * 100} />
          </CardHeader>
          <CardContent className="px-4">
            <Button
              className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
              size="sm"
            >
              Upgrade to Pro
              <SparklesIcon />
            </Button>
          </CardContent>
        </Card>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
