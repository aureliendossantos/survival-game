import type { AppProps } from "next/app"
import "../styles/global.scss"
import "/styles/cards.css"
import "/styles/event.scss"

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
