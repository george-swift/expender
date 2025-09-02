import Link from 'next/link'
import {
  BanknoteIcon,
  CircleCheckIcon,
  FileScanIcon,
  FileSpreadsheetIcon,
  FolderKanbanIcon,
  FolderTreeIcon,
  HandCoinsIcon,
  ReceiptTextIcon,
  ScanTextIcon,
  SparklesIcon,
  TrendingUpDownIcon
} from 'lucide-react'
import * as motion from 'motion/react-client'

import { cn } from '@/lib/utils'
import { Container } from '@/components/container'
import { Gradient } from '@/components/gradient'
import { Header } from '@/components/main-header'
import {
  Screenshot,
  ScreenshotWithBottomGradient
} from '@/components/screenshot'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero section */}
        <Gradient />
        <Container
          className="flex flex-col items-center pb-24 pt-16 sm:pb-32 sm:pt-24 md:py-48"
          wrapperClasses="relative"
        >
          <h1 className="text-center text-pretty text-4xl/[0.9] font-bold tracking-tight sm:text-5xl">
            Track expenses, but smarter.
          </h1>
          <p className="mt-6 max-w-xl text-lg/7 text-center">
            Doing your expenses is as easy as taking a photo of your receipts.
            Expender uses AI to extract key details securely and deliver clear,
            actionable insights in seconds. Open-source, and built for everyone.
          </p>
          <div className="mt-10 space-x-4">
            <Link className={buttonVariants()} href="/sign-up">
              Start tracking for free
            </Link>
          </div>
          <Screenshot
            alt="Expenser Smart Scan feature"
            className="mt-16 sm:h-auto sm:w-2xl"
            height={313}
            src="/screenshots/smartscan.png"
            srcDark="/screenshots/smartscan-dark.png"
            width={512}
          />
        </Container>

        {/* Use cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          id="use-cases"
        >
          <Container className="pb-24 lg:pb-32">
            <hgroup className="mx-auto max-w-2xl text-center lg:mx-auto">
              <p className="font-mono text-xs/5 font-semibold uppercase tracking-widest">
                Use cases
              </p>
              <h2 className="mt-2 text-4xl/[0.9] font-semibold tracking-tight text-pretty sm:text-5xl">
                It&apos;s all about staying on top of your money.
              </h2>
            </hgroup>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {useCases.map(useCase => (
                  <div className="flex flex-col" key={useCase.name}>
                    <dt className="text-base/7 font-semibold">
                      <div className="mb-6 flex size-10 items-center justify-center rounded-lg bg-primary">
                        <useCase.icon
                          aria-hidden="true"
                          className="size-6 text-primary-foreground"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <p>{useCase.name}</p>
                        {useCase.badge && (
                          <Badge variant="outline">{useCase.badge}</Badge>
                        )}
                      </div>
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base/7">
                      <p className="flex-auto">{useCase.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-24 sm:py-32"
          id="how-it-works"
        >
          <Container
            className="sm:text-center lg:max-w-2xl"
            wrapperClasses="max-w-6xl mx-auto"
          >
            <p className="font-mono text-xs/5 font-semibold uppercase tracking-widest">
              How it works
            </p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl sm:text-balance">
              See how easy tracking expenses can be
            </h2>
          </Container>
          <ScreenshotWithBottomGradient
            alt="Expenser dashboard"
            className="pt-16"
            height={1442}
            src="/screenshots/dashboard.png"
            srcDark="/screenshots/dashboard-dark.png"
            width={2432}
          />
          <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
            <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
              {workflowSteps.map(step => (
                <div key={step.name} className="relative pl-9">
                  <dt className="inline font-semibold">
                    <step.icon
                      aria-hidden="true"
                      className="absolute top-1 left-1 size-5"
                    />
                    {step.name}
                  </dt>{' '}
                  <dd className="inline">{step.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-6 py-24 sm:py-32"
          id="faqs"
        >
          <hgroup className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs/5 font-semibold uppercase tracking-widest">
              Frequently asked questions
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              Your questions answered
            </h2>
          </hgroup>
          <Accordion
            className="mt-10 max-w-2xl mx-auto"
            collapsible
            type="single"
          >
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={String(idx)}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </main>

      <footer className="bg-black text-white">
        <Container>
          {/* Call to action */}
          <div className="relative pb-24 pt-20 text-center sm:pt-32">
            <hgroup>
              <p className="font-mono text-xs/5 font-semibold uppercase tracking-widest">
                Get started
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                Take control of your expenses
              </h2>
            </hgroup>
            <p className="mx-auto mt-6 max-w-xl text-lg">
              Stop guessing where your money goes. Expender makes it easy to
              track, analyze, and optimize your spending—so you focus on what
              matters.
            </p>
            <div className="mt-6">
              <Link
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'text-primary w-full sm:w-auto'
                )}
                href="/sign-up"
              >
                Create a new account
              </Link>
            </div>
          </div>

          {/* Footer links */}
          <div className="py-8 border-t border-white/10 md:flex md:items-center md:justify-between">
            <div className="flex justify-center gap-x-6 md:order-2">
              {footerLinks.map(({ href, title }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className="text-xs underline-offset-4 hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {title}
                </Link>
              ))}
            </div>
            <div className="mt-8 text-xs flex items-end justify-center gap-1 md:order-1 md:mt-0">
              <div className="inline-flex items-center gap-1">
                <ReceiptTextIcon className="size-3" />
                <span>Expender {new Date().getFullYear()}.</span>
              </div>{' '}
              <div>All rights reserved.</div>
            </div>
          </div>
        </Container>
      </footer>
    </>
  )
}

const faqs = [
  {
    question: 'How do I add expenses in Expender?',
    answer: (
      <p>
        You can add expenses manually one at a time, or in batches of up to 25,
        or use Smart Scan to upload a photo or PDF of your receipt. Smart Scan
        will automatically extract and categorize the details for you.
      </p>
    )
  },
  {
    question: 'What is Smart Scan and how does it work?',
    answer: (
      <div>
        <p>
          Smart Scan turns any receipt into a structured expense entry in under
          10 seconds. Simply upload a photo or PDF from your device, and our AI
          suite extracts all the key details automatically.
        </p>
        <p className="mt-2">
          Behind the scenes, we use advanced OCR technology and AI to read
          merchant names, amounts, dates, and even suggest the right expense
          category. You&apos;ll see a pre-filled form to review and save—no
          manual typing required.
        </p>
      </div>
    )
  },
  {
    question: 'Is my data and uploaded receipts secure?',
    answer: (
      <div>
        <p>
          Absolutely. Your data security is our top priority. All receipts are
          stored in encrypted cloud storage that only you can access.
        </p>
        <p className="mt-2">
          We use enterprise-grade security measures including encrypted data
          transmission, secure authentication via Clerk, and zero-trust
          architecture in AWS. Your receipts are processed by AI for data
          extraction, but no personal information is stored by the AI providers.
        </p>
      </div>
    )
  },
  {
    question: 'How much does it cost?',
    answer: (
      <div>
        <p>
          Expender is free to start—no credit card required. You get 30 Smart
          Scans per month, unlimited manual entries, full dashboard access, and
          CSV exports.
        </p>
        <p className="mt-2">
          Need more? Pro is just $9/month for unlimited everything, plus early
          access to new features like AI Copilot. Perfect for businesses or
          heavy users.
        </p>
      </div>
    )
  },
  {
    question: 'What does the Pro tier include?',
    answer: (
      <div>
        <p>
          Pro ($9/month) removes all limits and unlocks advanced features:
          unlimited Smart Scans, priority support, and early access to new
          features like Copilot.
        </p>
        <p className="mt-2">
          Perfect for power users, small businesses, or anyone processing more
          than 30 receipts with Smart Scan monthly. More integrations and
          advanced analytics are coming soon.
        </p>
      </div>
    )
  },
  {
    question: 'What is Copilot and when will it be available?',
    answer: (
      <p>
        Copilot is an upcoming feature that lets you engage with your expense
        data through an AI assistant. You could ask questions like “How much did
        I spend on travel last month?” and get predictive budgeting advice. It
        will be available to Pro users soon.
      </p>
    )
  },
  {
    question: 'Can I export my expenses?',
    answer: (
      <div>
        <p>
          Yes, exporting is simple and flexible. Generate CSV files with exactly
          the data you need—customize which columns to include based on your
          expenses table view.
        </p>
        <p className="mt-2">
          Perfect for tax preparation, accounting software imports, or creating
          custom reports for clients and reimbursements. Your data, your way.
        </p>
      </div>
    )
  },
  {
    question: 'How do I get started?',
    answer: (
      <p>
        Getting started is easy. You can sign up with your email and name, or
        use Apple, or Google. Passkey login is also supported for added
        security.
      </p>
    )
  },
  {
    question: 'What kind of insights does the dashboard provide?',
    answer: (
      <p>
        The dashboard gives you a clear overview of your spending, with filters
        for date, category, amount, and currency. You can quickly see trends,
        top categories, and more.
      </p>
    )
  },
  {
    question:
      'Are integrations with accounting, finance, or tax software supported?',
    answer: (
      <p>
        Not yet, but integrations are planned for future releases. Quickbooks is
        likely to be available soon.
      </p>
    )
  }
]

const footerLinks = [
  { href: '#', title: 'Terms of Service' },
  { href: '#', title: 'Privacy Policy' },
  { href: 'https://github.com/george-swift/expender', title: 'GitHub' }
]

const workflowSteps = [
  {
    name: '1. Upload Your Receipt.',
    description:
      'Take a photo or select a file from your device. Supports PDF, PNG, and JPG formats for maximum flexibility.',
    icon: FileScanIcon
  },
  {
    name: '2. AI Processes Your Data.',
    description:
      'Our AI suite reads the receipt, extracts merchant name, amount, date, and automatically suggests the right category.',
    icon: SparklesIcon
  },
  {
    name: '3. Review & Save.',
    description:
      'Check the pre-filled form, make any adjustments, then save. The whole Smart Scan process takes under 10 seconds.',
    icon: CircleCheckIcon
  },
  {
    name: '4. Track Your Progress.',
    description:
      'Watch your dashboard update instantly with new insights, charts, and spending trends across all your expenses.',
    icon: TrendingUpDownIcon
  },
  {
    name: '5. Export When Ready.',
    description:
      'Generate CSV reports with your preferred data columns for accounting, tax prep, or personal budgeting.',
    icon: FileSpreadsheetIcon
  },
  {
    name: '6. Stay Organized.',
    description:
      'Filter by date, category, or amount to find exactly what you need. Multi-currency support keeps everything isolated.',
    icon: FolderTreeIcon
  }
]

const useCases = [
  {
    description:
      'Control personal finances by understanding where your money goes. Identify spending patterns, set budgets, and make smarter financial decisions.',
    icon: HandCoinsIcon,
    name: 'Personal Budgeting'
  },
  {
    description:
      'Streamline expense management across teams, track spending by category, and generate reports for accounting and reimbursements.',
    icon: FolderKanbanIcon,
    name: 'Small Business Teams'
  },
  {
    description:
      'Perfect for those who need to track business expenses for client billing and tax deductions. Never lose a receipt again.',
    icon: ScanTextIcon,
    name: 'Freelancers and Consultants'
  },
  {
    description:
      'Organize your receipts year-round and export clean, categorized data when tax season arrives. Save hours and reduce stress during filing.',
    icon: FileSpreadsheetIcon,
    name: 'Tax Season Prep'
  },
  {
    description:
      'Track spending across multiple currencies while traveling for work or pleasure. Perfect for digital nomads and international business travelers.',
    icon: BanknoteIcon,
    name: 'Travel & International'
  },
  {
    badge: 'Coming soon',
    description:
      'Get personalized insights and predictive budget recommendations. Perfect for anyone looking to optimize their spending habits with AI.',
    icon: SparklesIcon,
    name: 'Financial AI Copilot'
  }
]
