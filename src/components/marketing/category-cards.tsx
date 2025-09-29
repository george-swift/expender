import Image, { StaticImageData } from 'next/image'
import MealsImg from '@/public/images/meals.avif'
import ShoppingImg from '@/public/images/shopping.avif'
import TravelImg from '@/public/images/travel.avif'

interface CategoryCard {
  image: StaticImageData
  alt: string
  emoji: string
  category: string
  amount: string
  title: string
  description: string
}

const categories: CategoryCard[] = [
  {
    image: ShoppingImg,
    alt: 'Shopping bag',
    emoji: '🛍️',
    category: 'Shopping',
    amount: '244,50€',
    title: 'Save Time',
    description:
      'No more manual data entry - just snap, scan, and save instantly.'
  },
  {
    image: TravelImg,
    alt: 'Airplane',
    emoji: '✈️',
    category: 'Travel',
    amount: '$342.75',
    title: 'Make Decisions',
    description:
      'Export detailed reports to understand and optimize your spending.'
  },
  {
    image: MealsImg,
    alt: 'Restaurant',
    emoji: '🍔',
    category: 'Meals and Entertainment',
    amount: '₦144,650',
    title: 'Stay Organized',
    description:
      'Automatic categorization keeps your expenses perfectly organized.'
  }
]

function CategoryCard({ card }: { card: CategoryCard }) {
  return (
    <div className="space-y-6">
      <div className="relative h-[500px] rounded-3xl w-full lg:h-[380px] xl:h-[500px]">
        <Image
          src={card.image}
          alt={card.alt}
          placeholder="blur"
          className="rounded-[inherit] object-cover size-[inherit]"
        />
        <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-50 bg-(image:--img-overlay)" />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 rounded-3xl z-1">
          <div className="flex items-center justify-center h-8 px-3 w-fit rounded-[38px] bg-background-light text-sm/[18px]">
            {card.emoji} &nbsp;{card.category}
          </div>
          <div className="text-[38px]/[38px] tracking-[-1px] font-medium text-background-light">
            {card.amount}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-balance">
        <p className="text-lg/[23px] font-medium xl:text-xl/[26px]">
          {card.title}
        </p>
        <p className="text-sm text-grey-1">{card.description}</p>
      </div>
    </div>
  )
}

export function CategoryCards() {
  return (
    <section className="flex flex-col items-center justify-center gap-14 px-4 max-w-7xl mx-auto lg:px-6 pt-20 lg:pt-40 xl:gap-16">
      <h2 className="text-4xl text-center text-balance font-medium lg:text-[40px]/[42px] lg:w-1/2">
        Everything you need, nothing you don&apos;t
      </h2>

      <div className="grid gap-12 lg:gap-6 lg:grid-cols-[repeat(3,309px)] xl:gap-4 xl:grid-cols-[repeat(3,320px)]">
        {categories.map((card, index) => (
          <CategoryCard key={index} card={card} />
        ))}
      </div>
    </section>
  )
}
