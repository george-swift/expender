'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  ArrowLeftRightIcon,
  BotIcon,
  FileScanIcon,
  FileSpreadsheetIcon,
  HeadsetIcon,
  HomeIcon,
  NewspaperIcon,
  ReceiptTextIcon,
  RefreshCwIcon,
  RocketIcon,
  SettingsIcon,
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
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton
} from '@/components/ui/sidebar'

export function AppSidebar({
  quota,
  ...props
}: { quota: Quota } & React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  const { user } = useUser()

  const quotaLimit = quota?.limit ?? FREE_PLAN_SMART_SCAN_LIMIT

  const waitlistDialog = useDialog()

  const navigation = {
    main: [
      {
        icon: HomeIcon,
        title: 'Dashboard',
        url: '/dashboard'
      },
      {
        icon: ArrowLeftRightIcon,
        title: 'Expenses',
        url: '/expenses'
      },
      {
        icon: SparklesIcon,
        items: [
          {
            disabled: true,
            icon: FileScanIcon,
            title: 'Smart Scan',
            url: '/ai/smart-scan'
          },
          {
            disabled: true,
            icon: BotIcon,
            title: 'Copilot',
            url: '/ai/copilot'
          }
        ],
        title: 'AI Suite',
        url: '#'
      },
      {
        icon: SettingsIcon,
        title: 'Settings',
        url: '/settings'
      }
    ],
    secondary: [
      {
        icon: RefreshCwIcon,
        title: 'Refresh',
        url: '#',
        onClick: () => router.refresh()
      },
      {
        icon: NewspaperIcon,
        title: 'Blog',
        url: '/blog'
      },
      {
        icon: HeadsetIcon,
        title: 'Help Center',
        url: '/support'
      }
    ]
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          className="justify-center !size-8 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link
            href="/"
            className="aspect-square flex items-center justify-center"
          >
            <ReceiptTextIcon className="size-6 stroke-2" />
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavSite items={navigation.main} />
        <Separator className="mx-auto !w-[calc(100%-theme(space.4))]" />
        <NavSite items={navigation.secondary} />
      </SidebarContent>
      <SidebarFooter>
        <Card className="gap-2 py-4 shadow-none group-data-[state=collapsed]:hidden">
          <CardHeader className="px-4">
            <CardTitle className="text-sm">Smart Scan Usage</CardTitle>
            <CardDescription>
              {quota?.used ?? 0}/{quotaLimit} scans in the last 30 days
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
                <li className="flex items-center gap-2">
                  <FileScanIcon className="size-4 stroke-[1.5]" />
                  Unlimited Smart Scans per month
                </li>
                <li className="flex items-center gap-2">
                  <BotIcon className="size-4 stroke-[1.5]" />
                  AI Copilot to interact with for personalized insights
                </li>
                <li className="flex items-center gap-2">
                  <FileSpreadsheetIcon className="size-4 stroke-[1.5]" />
                  Advanced expense analytics & insights
                </li>
                <li className="flex items-center gap-2">
                  <HeadsetIcon className="size-4 stroke-[1.5]" />
                  Priority customer support
                </li>
                <li className="flex items-center gap-2">
                  <RocketIcon className="size-4 stroke-[1.5]" />
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
                <Button className="flex-1" disabled>
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
