import { ReactNode } from "react"

type CardProps = {
  children?: ReactNode
}

export default function Layout({ children }: CardProps) {
  return (
    <div className="mx-auto max-w-[480px] bg-bg-950 text-white">{children}</div>
  )
}
