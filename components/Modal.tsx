import React, { useEffect } from "react"
import { ModalProps, Modal as MuiModal } from "@mui/base/Modal"

interface Props extends Omit<ModalProps, "open"> {
  setOpen: any
  setClose: any
}

export default function Modal({ children, setOpen, setClose }: Props) {
  const [open, useOpen] = React.useState(false)
  const handleOpen = () => useOpen(true)
  const handleClose = () => useOpen(false)
  useEffect(() => setOpen(() => handleOpen), [setOpen])
  useEffect(() => setClose(() => handleClose), [setClose])

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <>
        <div
          onClick={handleClose}
          className="fixed inset-0 -z-10 bg-black/50"
        />
        <div className="flex max-w-sm flex-col rounded-md border-b-4 border-[#2f2927] bg-[#4d423f] p-3">
          {children}
        </div>
      </>
    </MuiModal>
  )
}
