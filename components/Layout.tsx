import { ReactNode } from "react"

type CardProps = {
  children?: ReactNode
}

export default function Layout({ children }: CardProps) {
  return (
    <div className="mx-auto my-[9px] max-w-[480px] bg-[#1c1817] text-white">
      {children}
    </div>
  )
}
