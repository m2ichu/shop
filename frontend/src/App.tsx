import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
				</Route>
        <Route path="/user/" element={<Header />}>
					<Route index element={<Home />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
