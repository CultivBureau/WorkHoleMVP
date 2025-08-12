import './App.css'
import SideMenu from './components/side-menu/side-menu'
import NavBar from './components/NavBar/navbar'
function App() {
  return (
    <div className='w-full h-screen ' style={{ background: 'var(--bg-color)' }}>
      <SideMenu />
      <NavBar/> 
    </div>
  )
}

export default App
