export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 100 24" aria-hidden="true" {...props}>
      <text
        x="0"
        y="18"
        className="fill-zinc-900 dark:fill-white text-lg font-bold"
        style={{ fontSize: '18px', fontWeight: 'bold' }}
      >
        AMIGO
      </text>
    </svg>
  )
}
