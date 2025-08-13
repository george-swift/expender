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
import { useDialog } from '@/hooks/use-dialog'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
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
      url: '#'
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
      disabled: true,
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
      url: '#'
    },
    {
      disabled: true,
      emoji: '🚀',
      title: 'Release Notes',
      url: '/release-notes'
    },
    {
      disabled: true,
      emoji: '🖇️',
      title: 'Terms & Policies',
      url: '#'
    }
  ]
}

export function AppSidebar({
  quota,
  ...props
}: { quota: Quota } & React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  const quotaLimit = quota?.limit ?? FREE_PLAN_SMART_SCAN_LIMIT

  const waitlistDialog = useDialog()

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
        <Card className="gap-2 py-4 shadow-none group-data-[state=collapsed]:hidden">
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
              onClick={waitlistDialog.trigger}
            >
              Upgrade to Pro
              <SparklesIcon />
            </Button>
          </CardContent>
        </Card>
        <NavUser user={user} />
      </SidebarFooter>

      <Dialog {...waitlistDialog.dialogProps}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
              <SparklesIcon className="size-6 text-primary" />
              <div>Pro Features Coming Soon!</div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-2 text-muted-foreground">
                What to expect:
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="size-4">🧾</div>
                  Unlimited Smart Scans per month
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-4">🤖</div>
                  AI Copilot to interact with for personalized insights
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-4">📊</div>
                  Advanced expense analytics & insights
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-4">📞</div>
                  Priority customer support
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-4">🚀</div>
                  Early access to new features
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm">Want to be notified when Pro launches?</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={waitlistDialog.dismiss}
                >
                  Maybe Later
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    // TODO: Add to waitlist/notification system
                    waitlistDialog.dismiss()
                  }}
                >
                  Notify Me
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
