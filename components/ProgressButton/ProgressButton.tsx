import { AwesomeButtonProgress } from "react-awesome-button"
import AwesomeButtonStyles from "./awesomebutton.module.scss"
import IconButtonStyles from "./iconbutton.module.scss"
import { ReactNode } from "react"
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
  return (
    <AwesomeButtonProgress
      style={{ marginRight: "2px", marginBottom: "3px" }}
      size={iconSize ? "icon" : "auto"}
      type={disabled ? "disabled" : type || "primary"}
      cssModule={iconId ? IconButtonStyles : AwesomeButtonStyles}
      loadingLabel=""
      resultLabel=""
      disabled={disabled}
      active={!disabled}
      onPress={async (event, release) => {
        await task()
        console.log("Task done")
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
        {iconId && (
          <div className="flex flex-col overflow-hidden rounded-sm">
            <div className="mx-1 -mb-1 mt-1">
              <Icon id={iconId} size="58px" type={type} />
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
