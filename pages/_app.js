import '@styles/globals.css'
import localFont from 'next/font/local'
import { Poppins } from 'next/font/google'

const aoboshiOne = localFont({
  src: '../public/fonts/AoboshiOne-Regular.ttf',
  variable: '--font-aoboshi'
})

const poppins = localFont({ 
  src: [
    {path: '../public/fonts/Poppins-Regular.ttf', weight: '400'},
    {path: '../public/fonts/Poppins-Medium.ttf', weight: '500'},
    {path: '../public/fonts/Poppins-SemiBold.ttf', weight: '600'},
    {path: '../public/fonts/Poppins-Bold.ttf', weight: '700'},
    {path: '../public/fonts/Poppins-ExtraBold.ttf', weight: '800'},
  ],
  variable: '--font-poppins'
})

export default function App({ Component, pageProps }) {
  return (
    <main className={`${aoboshiOne.variable} ${poppins.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  )
}
