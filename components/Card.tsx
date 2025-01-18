import { ReactNode, useState } from "react"
import Modal from "./Modal"

type CardProps = {
  dottedBorder?: boolean
  icon?: string
  iconColor: string
  title: string
  position?: string
  description?: string
  authors?: string[]
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
  authors,
  contents,
  moreInfo,
  children,
}: CardProps) {
  const [open, setOpen] = useState(null)
  const [close, setClose] = useState(null)
  return (
    <div
      className={`card relative box-border flex flex-col overflow-hidden rounded text-[1rem] ${
        dottedBorder && "mt-[9px] border-2 border-bg-500"
      }`}
    >
      <div className="flex items-center bg-bg-700">
        <div className="m-[9.5px]">
          <div
            className={`relative flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-sm text-[x-large]`}
          >
            <div className={`${iconColor}`} />
            {icon == "camp" && <div className="spritesheet bg-[-600%_-300%]" />}
            {icon == "workbench" && (
              <div className="spritesheet bg-[-400%_-500%]" />
            )}
            {icon == "bag" && <div className="spritesheet bg-[-0%_-600%]" />}
            {icon == "book" && <div className="spritesheet bg-[-0%_-500%]" />}
            {icon == "chest" && (
              <div className="spritesheet bg-[-500%_-500%]" />
            )}
          </div>
        </div>
        <div className="grow leading-tight">
          <div className="font-bold">
            {title}{" "}
            {position && <span className="text-[smaller]">{position}</span>}
          </div>
          {description && (
            <div className="text-[smaller] italic">{description}</div>
          )}
        </div>
        {(authors || contents) && (
          <>
            <button onClick={open} className="px-3 text-xs">
              ⊕
            </button>
            <Modal setOpen={setOpen} setClose={setClose}>
              <div className="text-[smaller]">
                {authors && <p>Construit par {authors.join(", ")}.</p>}
                {contents &&
                  contents.map((line, index) => <div key={index}>{line}</div>)}
              </div>
            </Modal>
          </>
        )}
      </div>
      <div className="bg-bg-900 p-[9.5px] text-[smaller]">{children}</div>
      {moreInfo && (
        <div className="bg-bg-600 px-[0.6em] py-[0.3em] text-[smaller]">
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
