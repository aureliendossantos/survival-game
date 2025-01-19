import { ReactNode } from "react"
import Color from "color"
import Icon from "components/Windows/Icon"

type ButtonProps = {
  label?: ReactNode
  iconId?: string | number
  type?: "primary" | "secondary"
  stamina?: number
  task: Function
  disabled?: boolean
  iconSize?: boolean
}

export default function ProgressButton({
  label,
  iconId,
  type,
  stamina,
  task,
  disabled,
  iconSize,
}: ButtonProps) {
  const dot = stamina > 0 ? "◦" : "•"
  const bg = Color(type == "secondary" ? "#908574" : "#747b90")
  const shadow = bg.lighten(0.2).string()
  const disabledBg = bg.lighten(0.4).string()
  return (
    <button
      className="shadow-4 hover:shadow-2 disabled:shadow-0 m-1 rounded-lg bg-[--bg] p-1 transition disabled:bg-[--disabled-bg]"
      style={{
        "--bg": bg.string(),
        "--shadow": shadow,
        "--disabled-bg": disabledBg,
        marginRight: "2px",
        marginBottom: "3px",
        width: iconSize && "40px",
        aspectRatio: iconSize && "1/1",
      }}
      disabled={disabled}
      onClick={async (event) => {
        const target = event.currentTarget
        target.disabled = true
        await task()
        if (target) target.disabled = false
      }}
    >
      <div className="relative h-full w-full">
        {label && (
          <div className="flex h-full items-center justify-center px-2 text-sm font-medium leading-relaxed">
            {label}
          </div>
        )}
        {iconId && (
          <div className="mx-[2px] mb-3">
            <Icon id={iconId} size="58px" type={type} />
          </div>
        )}
        {stamina != 0 && (
          <div className="absolute -bottom-[2px] w-full text-center text-[12px] leading-none text-white/50">
            {dot.repeat(Math.abs(stamina))}
          </div>
        )}
      </div>
    </button>
  )
}
