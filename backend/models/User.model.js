import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
  gender: {
    type: String,
    required: true
  },
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
	isSeller: {
		type: Boolean,
		required: true,
		default: false,
	},
	image: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
})

export default mongoose.model('User', userSchema)
