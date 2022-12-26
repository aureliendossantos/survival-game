import { AwesomeButtonProgress } from "react-awesome-button"
import AwesomeButtonStyles from "./awesomebutton.module.scss"

type ButtonProps = {
  label: any
  task: Function
  disabled?: boolean
  icon?: boolean
}

export default function ProgressButton({
  label,
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
      {label}
    </AwesomeButtonProgress>
  )
}
