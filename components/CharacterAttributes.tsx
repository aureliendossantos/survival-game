import ProgressBar from "@ramonak/react-progress-bar"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

export default function CharacterAttributes() {
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <div className="flex items-center gap-1">
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
