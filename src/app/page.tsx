import Link from 'next/link'
import {
  ChartGanttIcon,
  FileSpreadsheetIcon,
  FileStackIcon,
  PlaneTakeoffIcon,
  ReceiptTextIcon,
  ScanTextIcon,
  SparklesIcon
} from 'lucide-react'

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
            Expense tracking, but smarter.
          </h1>
          <p className="mt-6 max-w-xl text-lg/7 text-center">
            Managing your expenses is as easy as taking a photo of your
            receipts. Expender uses AI to extract key details securely and
            deliver clear, actionable insights in seconds. Open-source, and
            built for everyone.
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
        <Container className="pb-24 lg:pb-32">
          <hgroup className="mx-auto max-w-2xl text-center lg:mx-auto">
            <p className="font-mono text-xs/5 font-semibold uppercase tracking-widest">
              Use cases
            </p>
            <h2
              id="use-cases"
              className="mt-2 text-4xl/[0.9] font-semibold tracking-tight text-pretty sm:text-5xl"
            >
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
                      {useCase.badge && <Badge>{useCase.badge}</Badge>}
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

        {/* How it works */}
        <div className="py-24 sm:py-32">
          <Container
            className="sm:text-center lg:max-w-2xl"
            wrapperClasses="max-w-6xl mx-auto"
          >
            <p className="font-mono text-xs/5 font-semibold uppercase tracking-widest">
              How it works
            </p>
            <h2
              id="how-it-works"
              className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl sm:text-balance"
            >
              Lorem ipsum dolor.
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
        </div>

        {/* FAQs */}
        <div className="px-6 py-24 sm:py-32">
          <hgroup className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs/5 font-semibold uppercase tracking-widest">
              Frequently asked questions
            </p>
            <h2
              id="faqs"
              className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl"
            >
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
        </div>
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
      <p>
        Smart Scan lets you upload a receipt from your camera, photo library, or
        files. The receipt is securely uploaded to a private S3 bucket in the
        cloud. Expender (using Textract and OpenAI) extracts key data,
        auto-categorizes the expense, and presents it in a form for you to
        review and save.
      </p>
    )
  },
  {
    question: 'Is my data and uploaded receipts secure?',
    answer: (
      <p>
        Yes. All receipts are stored securely in the cloud. Only you can access
        your data unless you request technical support, and authentication is
        handled by Clerk. Expender only shares anonymized data with the AI model
        during data extraction and categorization.
      </p>
    )
  },
  {
    question: 'How much does it cost?',
    answer: (
      <p>
        Expender is free to use. But every new user on the free tier is limited
        to 30 Smart Scans per month. If you need more, you can upgrade to Pro
        for unlimited scans and future Copilot access.
      </p>
    )
  },
  {
    question: 'What does the Pro tier include?',
    answer: (
      <p>
        Pro is $5/month and gives you unlimited Smart Scans and access to
        Copilot (when available). More advanced features and integrations will
        be added over time.
      </p>
    )
  },
  {
    question: 'What is Copilot and when will it be available?',
    answer: (
      <p>
        Copilot is an upcoming feature that will let you chat with your expense
        data, ask questions like “How much did I spend on travel last month?”
        and get predictive budgeting advice. It will be available to Pro users
        soon.
      </p>
    )
  },

  {
    question: 'Can I export my expenses?',
    answer: (
      <p>
        Yes. You can export your expenses as a CSV file. The exported data
        matches the columns you see in your expenses table, so you control
        what’s included.
      </p>
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

const useCases = [
  {
    description:
      'Take a photo of your receipt after a purchase. Details like the merchant, date, and amount are extracted and categorized with AI, so you never lose track of business or personal expenses.',
    icon: ScanTextIcon,
    name: 'Track expenses on the go'
  },
  {
    description:
      'Reporting expenses could not be easier with Expender. You can create up to 25 different expenses in one go, each with details that matter to you. Handy for logging reimbursements.',
    icon: FileStackIcon,
    name: 'Streamline business expenses'
  },
  {
    description:
      'Export all your expenses as a comprehensive spreadsheet with one click, complete with data that is relevant to you, or download uploaded receipts. Make tax filing and audits stress-free.',
    icon: FileSpreadsheetIcon,
    name: 'Prepare for tax season'
  },
  {
    description:
      'Expender supports 18 different currencies in Europe, North & South America, Africa, and Asia, allowing you to stick to your budget and spot overspending even while away from home.',
    icon: PlaneTakeoffIcon,
    name: 'Stay within budget on holiday'
  },
  {
    description:
      'Your dashboard is designed to provide clear insights into your spending trends and patterns. See where your money goes, as far back as the last year, and make informed financial decisions.',
    icon: ChartGanttIcon,
    name: 'Financial insights at a glance'
  },
  {
    badge: 'Upcoming feature',
    description:
      'Ask your AI Copilot questions like “How much did I spend on subscriptions last month?” or “How often do I spend on dining out?”. Your Copilot provides predictive budgeting and personalized insights.',
    icon: SparklesIcon,
    name: 'Engage with your AI Copilot'
  }
]
