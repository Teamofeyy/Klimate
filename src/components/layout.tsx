import { PropsWithChildren } from 'react'
import Header from './header'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header />
        <main className='container mx-auto min-h-[calc(100vh-4rem)] px-4 py-8'>
            {children}
        </main>
        <footer className="border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto container px-4 text-center text-gray-400 ">
                <p>Сделано с ❤️ by Teamofeyy</p>
            </div>
        </footer>
    </div>
  )
}

export default Layout
