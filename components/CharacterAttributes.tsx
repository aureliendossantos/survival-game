import ProgressBar from "@ramonak/react-progress-bar"

export default function CharacterAttributes({ character }) {
  return (
    <div className="buttons-list">
      <span>Énergie</span>
      <ProgressBar
        completed={String(character.stamina)}
        maxCompleted={10}
        transitionDuration="0.5s"
        transitionTimingFunction="ease-out"
        bgColor="#427bf5"
        baseBgColor="#dae0ed"
        width="200px"
        margin="0 6px"
      />
    </div>
  )
}
