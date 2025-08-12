import './App.css'
import SideMenu from './components/side-menu/side-menu'
function App() {
  return (
    <div className='w-full h-screen ' style={{ background: 'var(--bg-color)' }}>
      <SideMenu />
      <main className='flex-1 p-6'>
        {/* Page content placeholder */}
      </main>
    </div>
  )
}

export default App
