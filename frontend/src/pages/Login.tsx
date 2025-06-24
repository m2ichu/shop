import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
	TextField,
	Button,
	FormControl,
	InputLabel,
	OutlinedInput,
	IconButton,
	InputAdornment
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const [showPassword, setShowPassword] = useState<boolean>(false)
  const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('http://localhost:3000/api/user/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailUsername: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Obsługa błędu z backendu
      alert(data.message || 'Błąd logowania');
      return;
    }

    // Zapisz token i dane użytkownika
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    console.log('Zalogowano pomyślnie:', data.user);

    // Przekieruj użytkownika
    navigate('/');
  } catch (error) {
    console.error('Błąd logowania:', error);
    alert('Wystąpił błąd podczas logowania.');
  } finally {
    setIsSubmitting(false);
  }
};

	return (
		<div className="min-h-screen flex flex-col items-center pt-30 px-4 bg-gray-50">
			<div className="mb-12 text-center">
				<h1 className="text-4xl font-bold text-gray-800 mb-2">Witaj z powrotem</h1>
				<div className="w-20 h-0.5 bg-gray-800 mx-auto"></div>
			</div>

			<form onSubmit={handleSubmit} className="w-full max-w-sm">
				<div className="mb-6">
					<TextField
						label="Email lub nazwa użytkownika"
						type="text"
						value={email}
						onChange={e => setEmail(e.target.value)}
						variant="outlined"
						fullWidth
						autoComplete="username"
						required
					/>
				</div>

				<div className="mb-8">
					<FormControl variant="outlined" fullWidth required>
						<InputLabel>Hasło</InputLabel>
						<OutlinedInput
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={e => setPassword(e.target.value)}
							endAdornment={
								<InputAdornment position="end">
									<IconButton 
										onClick={() => setShowPassword(!showPassword)} 
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
							label="Hasło"
							autoComplete="current-password"
						/>
					</FormControl>
				</div>

				<Button
					type="submit"
					variant="contained"
					size="large"
					fullWidth
					disabled={isSubmitting}
					sx={{
						py: 1.5,
						fontWeight: 600,
						background: 'linear-gradient(to right, #1e3a8a, #1e40af)',
						'&:hover': {
							opacity: 0.9,
							background: 'linear-gradient(to right, #1e3a8a, #1e40af)'
						}
					}}
				>
					{isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
				</Button>
			</form>

			{/* Link do rejestracji */}
			<p className="mt-8 text-sm text-gray-500">
				Nie masz konta?{' '}
				<Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
					Zarejestruj się
				</Link>
			</p>
			
			<Outlet />
		</div>
	)
}

export default Login