import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  IconButton,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    city: '',
    address: '',
    gender: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'Imię jest wymagane';
    if (!formData.lastName) newErrors.lastName = 'Nazwisko jest wymagane';

    if (!formData.email) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    if (!formData.username) newErrors.username = 'Nazwa użytkownika jest wymagana';

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Hasło musi zawierać dużą literę, cyfrę i znak specjalny';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }

    if (!formData.city) newErrors.city = 'Miasto jest wymagane';
    if (!formData.gender) newErrors.gender = 'Płeć jest wymagana';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        console.log('Rejestracja:', formData);
        // TODO: Wysłanie danych do backendu
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-30  px-4 py-8 bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dołącz do nas</h1>
        <div className="w-20 h-0.5 bg-gray-800 mx-auto"></div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        {/* Imię i Nazwisko */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField
            label="Imię"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Nazwisko"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            variant="outlined"
            fullWidth
          />
        </div>

        {/* Nazwa użytkownika */}
        <div className="mb-6">
          <TextField
            label="Nazwa użytkownika"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            variant="outlined"
            fullWidth
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            fullWidth
          />
        </div>

        {/* Hasło */}
        <div className="mb-6">
          <FormControl variant="outlined" fullWidth error={!!errors.password}>
            <InputLabel>Hasło</InputLabel>
            <OutlinedInput
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Hasło"
            />
            {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
          </FormControl>
        </div>

        {/* Potwierdź hasło */}
        <div className="mb-6">
          <FormControl variant="outlined" fullWidth error={!!errors.confirmPassword}>
            <InputLabel>Potwierdź hasło</InputLabel>
            <OutlinedInput
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Potwierdź hasło"
            />
            {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
          </FormControl>
        </div>

        {/* Miasto i Płeć */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField
            label="Miasto"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            variant="outlined"
            fullWidth
          />
          <FormControl variant="outlined" fullWidth error={!!errors.gender}>
            <InputLabel>Płeć</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Płeć"
            >
              <MenuItem value="male">Mężczyzna</MenuItem>
              <MenuItem value="female">Kobieta</MenuItem>
              <MenuItem value="other">Inna</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
        </div>

        {/* Adres */}
        <div className="mb-8">
          <TextField
            label="Adres"
            name="address"
            value={formData.address}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={2}
          />
        </div>

        {/* Przycisk rejestracji */}
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
          {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Masz już konto?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
          Zaloguj się
        </Link>
      </p>
    </div>
  );
};

export default Register;