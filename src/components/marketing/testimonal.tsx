import CreatorImg from '@/public/images/creator.jpeg'

import { ReceiptAvatar } from '@/components/marketing/receipt-avatar'

export function Testimonial() {
  return (
    <section
      id="why"
      className="flex flex-col items-center justify-center gap-8 pt-20 max-w-7xl mx-auto px-4 lg:px-6 lg:pt-40"
    >
      <h3 className="font-medium text-center text-balance max-w-4xl text-[32px]/[38px] xl:text-4xl/[43px]">
        &ldquo;I built Expender because I hated the time spent on spreadsheets
        and old receipts every month. These days, I only pull out my phone and
        do a SmartScan, AI handles everything - I just review and save.&rdquo;
      </h3>

      <div className="flex gap-2 items-center">
        <ReceiptAvatar src={CreatorImg} alt="Creator of Expender" />

        <div>
          <p className="text-base/[22px] font-medium">Ubong George</p>
          <p className="text-sm text-grey-1">Creator of Expender</p>
        </div>
      </div>
    </section>
  )
}
