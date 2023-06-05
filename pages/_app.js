import '@styles/globals.css'
import localFont from 'next/font/local'

const aoboshiOne = localFont({
  src: '../public/fonts/AoboshiOne-Regular.ttf',
  variable: '--font-aoboshi'
})


export default function App({ Component, pageProps }) {
  return (
    <main className={`${aoboshiOne.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  )
}
