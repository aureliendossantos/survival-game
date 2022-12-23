import { FaCampground } from "react-icons/fa"

export default function Card({
  icon,
  iconColor,
  title,
  position,
  description,
  author,
  contents,
  moreInfo,
}) {
  return (
    <div className="card">
      <div className="header">
        <div className={"icon " + iconColor}>
          {icon == "camp" ? <FaCampground /> : null}
        </div>
        <div className="text">
          <div className="title">
            {title}{" "}
            {position ? <span className="position">{position}</span> : null}
          </div>
          {description ? (
            <div className="description">{description}</div>
          ) : null}
        </div>
      </div>
      {author ? <div className="author">{author}</div> : null}
      <div className="contents">
        {contents
          ? contents.map((line, index) => <p key={index}>{line}</p>)
          : null}
      </div>
      {moreInfo ? (
        <div className="more-info">
          <ul>
            {moreInfo.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
