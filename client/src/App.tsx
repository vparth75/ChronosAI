import { BrowserRouter, Route, Routes } from "react-router-dom"

import HomePage from "@/pages/HomePage"
import LandingPage from "@/pages/LandingPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
