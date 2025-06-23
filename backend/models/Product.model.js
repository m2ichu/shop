import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	images: {
		type: [String],
		required: true,
	},
	amount: {
		type: Number,
		required: true,
		default: 1,
	},
	categoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
	subCategoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SubCategory',
		required: true,
	},
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	aproved: {
		type: Boolean,
		default: false,
	},
})

const Product = mongoose.model('Product', productSchema)
export default Product
