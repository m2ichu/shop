import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

export const register = async (req, res) => {
	try {
		const { name, surname, email, username, password, address, confirmPassword, gender, city } = req.body

		if (
			!name ||
			!surname ||
			!email ||
			!password ||
			!confirmPassword ||
			!username ||
			!address ||
			!gender ||
			!city ||
			username.length < 2
		) {
			return res.status(400).json({ message: 'All fields are required' })
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: 'Passwords do not match' })
		}

		const userByEmail = await User.findOne({ email })
		const userByUsername = await User.findOne({ username })

		if (userByEmail || userByUsername) {
			return res.status(400).json({ message: 'Username or email already exists' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const user = new User({
			name,
			surname,
			email,
			username,
			address,
			password: hashedPassword,
			gender,
			city,
			image:
				gender === 'male'
					? `https://avatar.iran.liara.run/public/boy?username=${username}`
					: `https://avatar.iran.liara.run/public/girl?username=${username}`,
		})
		await user.save()

		res.status(201).json({ message: 'User registered successfully' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error' })
	}
}

export const login = async (req, res) => {
	try {
		const { password, emailUsername } = req.body

		if (!emailUsername || !password) {
			return res.status(400).json({ message: 'Email or username and password are required' })
		}

		const user = await User.findOne({
			$or: [{ email: emailUsername }, { username: emailUsername }],
		})

		if (!user) {
			return res.status(401).json({ message: 'Invalid email/username or password' })
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid email/username or password' })
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' })

		res.status(200).json({
			token,
			user: {
				id: user._id,
				username: user.username,
				image: user.image,
			},
		})
	} catch (error) {
		console.error('Login error:', error)
		res.status(500).json({ message: 'Server error' })
	}
}

export const changeData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (req.body.email && req.body.email !== user.email) {
      const emailOwner = await User.findOne({ email: req.body.email })
      if (emailOwner && emailOwner._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email is already in use by another user' })
      }
      user.email = req.body.email
    }

    if (req.body.username && req.body.username !== user.username) {
      const usernameOwner = await User.findOne({ username: req.body.username })
      if (usernameOwner && usernameOwner._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username is already in use by another user' })
      }
      user.username = req.body.username
    }

    user.name = req.body.name || user.name
    user.surname = req.body.surname || user.surname
    user.address = req.body.address || user.address
    user.gender = req.body.gender || user.gender
    user.city = req.body.city || user.city
    user.image = req.body.image || user.image

    await user.save()

    res.status(200).json({ message: 'User data updated successfully', data: user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
