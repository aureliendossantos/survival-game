import { AwesomeButtonProgress } from "react-awesome-button"
import AwesomeButtonStyles from "./awesomebutton.module.scss"

type ButtonProps = {
  label: any
  stamina?: number
  task: Function
  disabled?: boolean
  icon?: boolean
}

export default function ProgressButton({
  label,
  stamina,
  task,
  disabled,
  icon,
}: ButtonProps) {
  return (
    <AwesomeButtonProgress
      style={{ marginRight: "2px", marginBottom: "3px" }}
      size={icon ? "icon" : "auto"}
      type={disabled ? "disabled" : "primary"}
      cssModule={AwesomeButtonStyles}
      loadingLabel=""
      resultLabel=""
      disabled={disabled}
      onPress={async (event, release) => {
        await task()
        release()
      }}
    >
      <div className="action-label">
        {stamina != 0 && (
          <div className={"stamina-dots" + (icon ? " dots-on-icon" : "")}>
            {(stamina > 0 ? "+ " : "") + "⦁".repeat(Math.abs(stamina))}
          </div>
        )}
        <div className="label">{label}</div>
      </div>
    </AwesomeButtonProgress>
  )
}
