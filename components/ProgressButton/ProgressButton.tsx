import { AwesomeButtonProgress } from "react-awesome-button"
import AwesomeButtonStyles from "./awesomebutton.module.scss"
import IconButtonStyles from "./iconbutton.module.scss"
import { ReactNode } from "react"

type ButtonProps = {
  label?: ReactNode
  iconClass?: string
  type?: "primary" | "secondary"
  stamina?: number
  task: Function
  disabled?: boolean
  iconSize?: boolean
}

export default function ProgressButton({
  label,
  iconClass,
  type,
  stamina,
  task,
  disabled,
  iconSize,
}: ButtonProps) {
  const dot = stamina > 0 ? "◦" : "•"
  return (
    <AwesomeButtonProgress
      style={{ marginRight: "2px", marginBottom: "3px" }}
      size={iconSize ? "icon" : "auto"}
      type={disabled ? "disabled" : type || "primary"}
      cssModule={iconClass ? IconButtonStyles : AwesomeButtonStyles}
      loadingLabel=""
      resultLabel=""
      disabled={disabled}
      onPress={async (event, release) => {
        await task()
        release()
      }}
    >
      <div className="relative h-full w-full">
        {label && (
          <>
            <div className="z-10">{label}</div>
            {stamina != 0 && (
              <div className="absolute left-0 top-[13px] h-full w-full text-center text-[12px] text-white/50">
                {dot.repeat(Math.abs(stamina))}
              </div>
            )}
          </>
        )}
        {iconClass && (
          <div className="flex flex-col overflow-hidden rounded-sm">
            <div className="relative mx-1 -mb-1 mt-1 h-[58px] w-[58px]">
              <div
                className={`spritesheet ${iconClass}`}
                style={{
                  filter: type != "secondary" ? "invert(100%)" : "contrast(.9)",
                }}
              />
            </div>
            <div className="mb-1 min-h-[16px] text-center text-[12px] text-white/50">
              {dot.repeat(Math.abs(stamina))}
            </div>
          </div>
        )}
      </div>
    </AwesomeButtonProgress>
  )
}
