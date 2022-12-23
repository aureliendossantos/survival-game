import { AwesomeButtonProgress } from "react-awesome-button"
import AwesomeButtonStyles from "./awesomebutton.module.scss"

export default function ProgressButton({ label, task, disabled, icon }) {
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
