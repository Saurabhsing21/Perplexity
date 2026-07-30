import { BrowserRouter, Route, Routes } from 'react-router'
import { Perplexity } from '../pages/home'
import Authpage from '../pages/authpage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Perplexity />} />
        <Route path="/auth" element={<Authpage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
