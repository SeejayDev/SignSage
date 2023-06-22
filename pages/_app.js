import '@styles/globals.css'
import localFont from 'next/font/local'
import { Poppins } from 'next/font/google'

const aoboshiOne = localFont({
  src: '../public/fonts/AoboshiOne-Regular.ttf',
  variable: '--font-aoboshi'
})

const poppins = Poppins({ 
  weight: ["400", "500", "600", "700", "800"],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export default function App({ Component, pageProps }) {
  return (
    <main className={`${aoboshiOne.variable} ${poppins.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  )
}
