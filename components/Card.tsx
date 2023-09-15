import { ReactNode } from "react"
import { FaCampground, FaHammer } from "react-icons/fa"
import { GiSchoolBag, GiWhiteBook } from "react-icons/gi"

type CardProps = {
  dottedBorder?: boolean
  icon?: string
  iconColor: string
  title: string
  position?: string
  description?: string
  author?: string[]
  contents?: string[]
  moreInfo?: string[]
  children?: ReactNode
}

export default function Card({
  dottedBorder,
  icon,
  iconColor,
  title,
  position,
  description,
  author,
  contents,
  moreInfo,
  children,
}: CardProps) {
  return (
    <div className={"card" + (dottedBorder ? " dotted" : "")}>
      <div className="header">
        <div className="m-[9.5px]">
          <div
            className={`relative flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-sm text-[x-large]`}
          >
            <div className={`${iconColor}`} />
            {icon == "camp" && <div className="spritesheet bg-[-600%_-300%]" />}
            {icon == "workbench" && <FaHammer className="z-10" />}
            {icon == "bag" && <GiSchoolBag className="z-10" />}
            {icon == "book" && <GiWhiteBook className="z-10" />}
          </div>
        </div>
        <div className="text">
          <div className="title">
            {title} {position && <span className="position">{position}</span>}
          </div>
          {description && <div className="description">{description}</div>}
        </div>
        {(author || contents) && (
          <div className="author">
            {author &&
              author.map((author, index) => <div key={index}>{author}</div>)}
            {contents &&
              contents.map((line, index) => <div key={index}>{line}</div>)}
          </div>
        )}
      </div>
      <div className="bg-[#2b1f1c] p-[0.6em] text-[smaller]">{children}</div>
      {moreInfo && (
        <div className="more-info">
          <ul>
            {moreInfo.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
