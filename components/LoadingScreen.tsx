import ProgressBar from "@ramonak/react-progress-bar"

type LoadingScreenProps = {
  text: string
  percentage: number
  error?: boolean
}

export default function LoadingScreen({
  text,
  percentage,
  error,
}: LoadingScreenProps) {
  return (
    <div className="loading">
      <ProgressBar
        animateOnRender
        isLabelVisible={false}
        completed={percentage}
        bgColor={error ? "pink" : "#2b6eff"}
        width="150px"
        margin="6px 0"
      />
      <p>{text}</p>
    </div>
  )
}
