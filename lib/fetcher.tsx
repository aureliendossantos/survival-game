export const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Accept: "application/json",
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Incorrect network response.")
    return res.json()
  })
