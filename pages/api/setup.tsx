import createDefaultData from "lib/api/createDefaultData"
import deleteAllTables from "lib/api/deleteAllData"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "DELETE") {
    await deleteAllTables()
    res.json({
      success: true,
      message: "Tables vidées.",
    })
  } else if (req.method == "POST") {
    await createDefaultData()
    res.json({
      success: true,
      message: "Tables remplies.",
    })
  } else {
    return res.status(405).json({ message: "Bad method" })
  }
}
