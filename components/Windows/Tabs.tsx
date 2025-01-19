import { TabsList as MuiTabsList } from "@mui/base/TabsList"
import { TabPanel as MuiTabPanel } from "@mui/base/TabPanel"
import { Tab as MuiTab } from "@mui/base/Tab"
import { Tabs } from "@mui/base"
import { ReactNode } from "react"
import { GiBackpack, GiCompass } from "react-icons/gi"

export function TabsList({ children }) {
  return (
    <MuiTabsList className="mb-3 flex content-between items-center justify-center rounded-xl bg-[#8b7c64] shadow-lg">
      {children}
    </MuiTabsList>
  )
}

export function Tab({ value, title }: { value: number; title: string }) {
  return (
    <MuiTab
      slotProps={{
        root: ({ selected, disabled }) => ({
          className: `${
            selected
              ? "text-neutral-800 bg-white"
              : "text-white bg-transparent hover:bg-[#a6977f]"
          } ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } text-sm font-medium w-full p-1 m-1 border-0 rounded-lg flex justify-center transition`,
        }),
      }}
      value={value}
    >
      {title}
    </MuiTab>
  )
}

export function TabPanel({ value, children }) {
  return (
    <MuiTabPanel className="w-full font-sans text-sm" value={value}>
      {children}
    </MuiTabPanel>
  )
}

/**
 * Holds the UI corresponding to each tab (in children) and the bottom modal (in container).
 */
export function MainTabs({ children, container }) {
  return (
    <Tabs defaultValue={1} className="flex grow flex-col gap-[9px]">
      {children}
      <div className="grow" />
      {/* Bottom margin behind the tabs */}
      <div className="h-10" />
      <div className="fixed bottom-0 z-10 w-full max-w-[480px]">
        <div className="bg-bg-700 px-3" ref={container} />
        <MainTabsList>
          <MainTab value={1}>
            <GiCompass />
          </MainTab>
          <MainTab value={2}>
            <GiBackpack />
          </MainTab>
        </MainTabsList>
      </div>
    </Tabs>
  )
}

function MainTab({ value, children }: { value: number; children: ReactNode }) {
  return (
    <MuiTab
      slotProps={{
        root: ({ selected, disabled }) => ({
          className: `${
            selected
              ? "text-neutral-800 bg-white"
              : "text-white bg-transparent hover:bg-[#a6977f]"
          } ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } text-3xl w-full p-1 border-0 flex justify-center transition`,
        }),
      }}
      value={value}
    >
      {children}
    </MuiTab>
  )
}

function MainTabsList({ children }) {
  return (
    <MuiTabsList className="flex content-between items-center justify-center bg-[#8b7c64] shadow-lg">
      {children}
    </MuiTabsList>
  )
}
