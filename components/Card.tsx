import { ReactNode } from "react"
import { FaCampground, FaHammer } from "react-icons/fa"

type CardProps = {
  dottedBorder?: boolean
  icon?: "camp" | "bench"
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
        <div className={"icon " + iconColor}>
          {icon == "camp" && <FaCampground />}
          {icon == "bench" && <FaHammer />}
        </div>
        <div className="text">
          <div className="title">
            {title} {position && <span className="position">{position}</span>}
          </div>
          {description && <div className="description">{description}</div>}
        </div>
        {(author || contents) && (
          <div className="author">
            {author && <div>{author}</div>}
            {contents &&
              contents.map((line, index) => <div key={index}>{line}</div>)}
          </div>
        )}
      </div>
      <div className="contents">{children}</div>
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
