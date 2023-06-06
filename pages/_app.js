import '@styles/globals.css'
import localFont from 'next/font/local'
import { Poppins } from 'next/font/google';

const aoboshiOne = localFont({
  src: '../public/fonts/AoboshiOne-Regular.ttf',
  variable: '--font-aoboshi'
})

const poppins = Poppins({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'] 
});
  
export default function App({ Component, pageProps }) {
  return (
    <main className={`${aoboshiOne.variable} ${poppins.className} font-sans`}>
      <Component {...pageProps} />
    </main>
  )
}
