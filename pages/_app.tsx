import type { AppProps } from "next/app"
import "../styles/global.scss"
import "/styles/cards.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
