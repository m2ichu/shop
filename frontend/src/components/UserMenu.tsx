import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'

const UserMenu = () => {
	const [open, setOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.removeItem('token')
		navigate('/home')
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div className="relative" ref={menuRef}>
			<button onClick={() => setOpen(!open)} className="focus:outline-none">
				<Avatar sx={{ bgcolor: '#facc15' }}>H</Avatar>
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
					<Link
						to="/profile"
						className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
						onClick={() => setOpen(false)}>
						Profil
					</Link>
					<Link
						to="/settings"
						className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
						onClick={() => setOpen(false)}>
						Ustawienia
					</Link>
					<button
						onClick={handleLogout}
						className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition">
						Wyloguj się
					</button>
				</div>
			)}
		</div>
	)
}

export default UserMenu
