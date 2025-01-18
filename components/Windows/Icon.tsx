export default function Icon({
  id,
  size,
  type,
}: {
  id: string | number
  size: string
  type?: "primary" | "secondary"
}) {
  const icon = getIcon(id)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className={`spritesheet ${icon}`}
        style={{
          filter: type != "secondary" ? "invert(100%)" : "contrast(.9)",
        }}
      />
    </div>
  )
}

function getIcon(id: string | number) {
  switch (id) {
    case "repair":
      return "bg-[-700%_-500%]"
    case "camp":
      return "bg-[-600%_-300%]"
    case "workbench":
      return "bg-[-400%_-500%]"
    case "chest":
      return "bg-[-500%_-500%]"
    case 1:
      return "bg-[-200%_-400%]"
    case 2:
      return "bg-[-100%_-0%]"
    case 4:
      return "bg-[-200%_-0%]"
    case 6:
      return "bg-[-100%_-500%]"
    case 7:
      return "bg-[-200%_-500%]"
    case 8:
      return "bg-[-100%_-400%]"
    case 9:
      return "bg-[-0%_-400%]"
    case 10:
      return "bg-[-600%_-400%]"
    case 11:
      return "bg-[-600%_-500%]"
    case 13:
      return "bg-[-700%_-400%]"
    default:
      return "bg-[-0%_-0%]"
  }
}
