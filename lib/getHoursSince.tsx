/**
 * Get the floored number of hours elapsed between now and the given Date.
 */
export default function getHoursSince(time: Date) {
  return Math.floor((new Date().getTime() - time.getTime()) / 3.6e6)
}
