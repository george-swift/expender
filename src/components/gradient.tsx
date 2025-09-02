import { cn } from '@/lib/utils'

export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        className,
        'select-none bg-gradient-to-t from-blue-100 to-blue-200 absolute inset-0 max-h-[500px] lg:max-h-[min(100vh,_900px)] dark:from-zinc-900 dark:to-zinc-800'
      )}
    >
      <div className="hidden lg:block">
        <div className="absolute inset-0 overflow-hidden contain-paint">
          <div className="absolute inset-[0.5rem] rounded-[12rem] bg-white/10 shadow-[0_0_40px_rgba(212,213,219,0.5)] blur-[4px] dark:bg-zinc-700/20 dark:shadow-[0_0_40px_rgba(63,63,70,0.5)]"></div>
          <div className="absolute inset-[3rem] rounded-[12rem] bg-white/10 shadow-[0_0_30px_rgba(212,213,219,0.4)] blur-[3px] dark:bg-zinc-700/20 dark:shadow-[0_0_30px_rgba(63,63,70,0.4)]"></div>
          <div className="absolute inset-[6rem] rounded-[12rem] bg-white/10 shadow-[0_0_20px_rgba(212,213,219,0.3)] blur-[2px] dark:bg-zinc-700/20 dark:shadow-[0_0_20px_rgba(63,63,70,0.3)]"></div>
          <div className="absolute inset-[10rem] rounded-[8rem] bg-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.4)] blur-[1px] dark:bg-zinc-700/20 dark:shadow-[inset_0_0_30px_rgba(255,255,255,0.08)]"></div>
        </div>
      </div>
    </div>
  )
}
