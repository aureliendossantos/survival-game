import { AwesomeButtonProgress } from "react-awesome-button"
import AwesomeButtonStyles from "./awesomebutton.module.scss"

type ButtonProps = {
  label: any
  dots?: number
  task: Function
  disabled?: boolean
  icon?: boolean
}

export default function ProgressButton({
  label,
  dots,
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
        {dots > 0 && (
          <div className={"effort-dots" + (icon ? " dots-on-icon" : "")}>
            {"⦁".repeat(dots)}
          </div>
        )}
        <div className="label">{label}</div>
      </div>
    </AwesomeButtonProgress>
  )
}
