'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { UserResource } from '@clerk/types'
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  MonitorCogIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UserCogIcon
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { getUserNameAndInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'

export function NavUser({ user }: { user: UserResource | null | undefined }) {
  const router = useRouter()

  const { signOut } = useClerk()

  const { isMobile } = useSidebar()

  const [mounted, setMounted] = useState(false)

  const { setTheme, theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) {
    return null
  }

  const { name, initials } = getUserNameAndInitials(user)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="group-data-[collapsible=icon]:pl-0! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={name ?? ''} src={user?.imageUrl} />
                <AvatarFallback className="rounded-lg uppercase">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={name ?? ''} src={user.imageUrl} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MonitorCogIcon className="size-4 mr-2 text-muted-foreground" />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    onValueChange={setTheme}
                    value={theme}
                  >
                    <DropdownMenuRadioItem
                      aria-label="Switch to Light Mode"
                      iconType="check"
                      value="light"
                    >
                      <SunIcon aria-hidden="true" className="size-4 shrink-0" />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      aria-label="Switch to Dark Mode"
                      iconType="check"
                      value="dark"
                    >
                      <MoonIcon
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      aria-label="Switch to System Mode"
                      iconType="check"
                      value="system"
                    >
                      <MonitorIcon
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                onClick={() => {
                  router.push('/settings')
                }}
              >
                <UserCogIcon />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
