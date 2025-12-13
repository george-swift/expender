import CreatorImg from '@/public/images/creator.jpeg'

import { ReceiptAvatar } from '@/components/marketing/receipt-avatar'

export function Testimonial() {
  return (
    <section
      id="why"
      className="flex flex-col items-center justify-center gap-8 pt-20 max-w-7xl mx-auto max-lg:px-4 lg:pt-40"
    >
      <h3 className="font-medium text-center text-balance max-w-4xl text-[32px]/[38px] xl:text-4xl/[43px]">
        &ldquo;A great impact of Expender has been the time-savings. The Smart
        Scan feature alone removes almost all the hassle from managing
        expenses.&rdquo;
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
