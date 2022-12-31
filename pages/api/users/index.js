import prisma from "/lib/prisma"

export default async (req, res) => {
  if (req.method == "POST") {
    const user = await prisma.user.create({
      data: { name: req.body.name },
    })
    return res.json({
      success: true,
      message: `Compte ${user.name} créé.`,
    })
  } else if (req.method == "GET") {
    const query = await prisma.user.findMany()
    return res.json(query)
  }
  return res.status(405).json({ message: "Method not allowed" })
}
