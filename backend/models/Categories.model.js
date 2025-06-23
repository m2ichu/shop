import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	subCategoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SubCategory',
	},
})

export default mongoose.model('Category', CategorySchema)
