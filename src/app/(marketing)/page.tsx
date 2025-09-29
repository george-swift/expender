import { CategoryCards } from '@/components/marketing/category-cards'
import { CallToAction } from '@/components/marketing/cta'
import { Hero } from '@/components/marketing/hero'
import { PrimaryFeatures } from '@/components/marketing/primary-features'
import { SecondaryFeatures } from '@/components/marketing/secondary-features'
import { Testimonial } from '@/components/marketing/testimonal'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PrimaryFeatures />
      <CategoryCards />
      <SecondaryFeatures />
      <Testimonial />
      <CallToAction />
    </>
  )
}
