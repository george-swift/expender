'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, type LucideIcon } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'

interface NavItem {
  disabled?: boolean
  emoji?: React.ReactNode
  icon?: LucideIcon
  items?: NavItem[]
  title: string
  url: string
}

export function NavSite({
  className,
  items,
  label
}: {
  items: NavItem[]
  label?: string
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  const isActive = (itemHref: string) =>
    pathname === itemHref || pathname.startsWith(itemHref)

  const isPublicRoute = (itemHref: string) =>
    ['/', '/policies'].includes(itemHref)

  return (
    <SidebarGroup className={className}>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map(item => {
          if (!item.items?.length) {
            return (
              <SidebarMenuItem aria-disabled={item.disabled} key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  tooltip={item.title}
                >
                  <Link
                    aria-disabled={item.disabled}
                    href={item.url}
                    target={isPublicRoute(item.url) ? '_blank' : '_self'}
                  >
                    {item.icon && <item.icon />}
                    {item.emoji && <span>{item.emoji}</span>}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              asChild
              className="group/collapsible"
              defaultOpen={isActive(item.url)}
              key={item.title}
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    {item.emoji && <span>{item.emoji}</span>}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction
                    className="bg-sidebar-accent text-sidebar-accent-foreground left-2 data-[state=open]:rotate-90"
                    showOnHover
                  >
                    <ChevronRightIcon />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map(subItem => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            aria-disabled={subItem.disabled}
                            href={subItem.url}
                            target={
                              isPublicRoute(item.url) ? '_blank' : '_self'
                            }
                          >
                            {subItem.icon && <subItem.icon />}
                            {subItem.emoji && <span>{subItem.emoji}</span>}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
