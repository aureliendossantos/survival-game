import ProgressBar from "@ramonak/react-progress-bar"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

export default function CharacterAttributes() {
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <div className="grid grid-cols-2 gap-3 text-sm font-medium">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col">
          <div className="-mb-[2px] flex justify-between">
            <span>Énergie</span>
            <span className="font-semibold">{character.stamina}</span>
          </div>
          <ProgressBar
            completed={String(character.stamina)}
            maxCompleted={10}
            bgColor="#427bf5"
            height="5px"
            margin="0"
            padding="0"
            borderRadius="2px"
            baseBgColor="#9599a3"
            isLabelVisible={false}
            transitionDuration="0.5s"
            transitionTimingFunction="ease-out"
          />
        </div>
        <div className="flex justify-between">
          <span>Repos</span>
          <span className="font-medium text-blue-200">En forme</span>
        </div>
      </div>
    </div>
  )
}
