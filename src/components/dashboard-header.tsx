'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import {
  PlusIcon,
  ReceiptTextIcon,
  ScanTextIcon,
  TableIcon
} from 'lucide-react'

import { useDialog } from '@/hooks/use-dialog'
import { ExpenseForm } from '@/components/expense-form'
import { ExpensesForm } from '@/components/expenses-form'
import { SmartScanForm } from '@/components/smartscan-form'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function DashboardHeader() {
  const segment = useSelectedLayoutSegment()

  const smartScanDialog = useDialog()
  const newExpenseDialog = useDialog()
  const multipleExpensesDialog = useDialog()

  return (
    <header className="sticky z-50 top-0 flex h-16 shrink-0 items-center gap-2 bg-background border-b md:rounded-t-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 w-full lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mr-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {(segment === 'dashboard' || segment === 'expenses') && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto">
                <PlusIcon className="size-4" />
                <span>New Expense</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={smartScanDialog.trigger}>
                <ScanTextIcon className="size-4" />
                <span className="text-sm">Scan Receipt</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={newExpenseDialog.trigger}>
                <ReceiptTextIcon className="size-4" />
                <span className="text-sm">Manually Create</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={multipleExpensesDialog.trigger}>
                <TableIcon className="size-4" />
                <span className="text-sm">Create Multiple</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Dialog {...smartScanDialog.dialogProps}>
          <DialogContent
            onEscapeKeyDown={e => {
              e.preventDefault()
            }}
            onInteractOutside={e => {
              e.preventDefault()
            }}
          >
            <SmartScanForm close={smartScanDialog.dismiss} />
          </DialogContent>
        </Dialog>

        <Dialog {...newExpenseDialog.dialogProps}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm close={newExpenseDialog.dismiss} />
          </DialogContent>
        </Dialog>

        <Dialog {...multipleExpensesDialog.dialogProps}>
          <DialogContent className="sm:max-w-6xl">
            <DialogHeader>
              <DialogTitle>New Expenses</DialogTitle>
            </DialogHeader>
            <ExpensesForm close={multipleExpensesDialog.dismiss} />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
