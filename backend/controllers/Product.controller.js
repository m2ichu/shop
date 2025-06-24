import Product from '../models/Product.model.js'
import Category from '../models/Categories.model.js'
import SubCategory from '../models/SubCategories.model.js'
import User from '../models/User.model.js'

export const createProduct = async (req, res) => {
	try {
		const userId = req.user?.userId

		if (!userId) {
			return res.status(400).json({ message: 'User ID is required' })
		}

		const { title, description, price, images, amount, category, subCategory } = req.body

		if (!title || !description || !price || !images || !amount || !category) {
			return res.status(400).json({ message: 'All fields are required (category required)' })
		}

		const foundCategory = await Category.findOne({ name: category })
		if (!foundCategory) {
			return res.status(400).json({ message: 'Category not found' })
		}

		let foundSubCategory = null
		if (subCategory) {
			foundSubCategory = await SubCategory.findOne({ name: subCategory, categoryId: foundCategory._id })

			if (!foundSubCategory) {
				foundSubCategory = await SubCategory.create({
					name: subCategory,
					categoryId: foundCategory._id,
					approved: false,
				})
			}
		} else {
			return res.status(400).json({ message: 'SubCategory is required' })
		}

		const productData = {
			title,
			description,
			price,
			images,
			amount,
			categoryId: foundCategory._id,
			subCategoryId: foundSubCategory._id,
			user: userId,
		}

		const product = await Product.create(productData)
		res.status(201).json(product)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

export const getProducts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = 30

		const sortBy = req.query.sortBy || 'createdAt'
		const order = req.query.order === 'asc' ? 1 : -1

		const filter = { aproved: true }

		const total = await Product.countDocuments(filter)

		const products = await Product.find(filter)
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ [sortBy]: order })

		res.json({
			products,
			page,
			totalPages: Math.ceil(total / limit),
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const getUserProduct = async (req, res) => {
	try {
		const id = req.params.id || req.query.id
		const { user } = req.query
		const page = parseInt(req.query.page) || 1
		const limit = 30

		const sortBy = req.query.sortBy || 'createdAt'
		const order = req.query.order === 'asc' ? 1 : -1

		if (user) {
			const owner = await User.findOne({ username: user })
			if (!owner) {
				return res.status(404).json({ message: 'User not found' })
			}

			const filter = { user: owner._id, aproved: true }

			const total = await Product.countDocuments(filter)
			const products = await Product.find(filter)
				.skip((page - 1) * limit)
				.limit(limit)
				.sort({ [sortBy]: order })

			return res.json({
				products,
				page,
				totalPages: Math.ceil(total / limit),
			})
		}

		if (id) {
			const product = await Product.findOne({ _id: id, aproved: true })
			if (!product) {
				return res.status(404).json({ message: 'Product not found or not approved' })
			}
			return res.json(product)
		}

		return res.status(400).json({ message: 'No product ID or user specified' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: error.message })
	}
}

export const getCategoryProduct = async (req, res) => {
	try {
		const { category, subCategory } = req.query
		const page = parseInt(req.query.page) || 1
		const limit = 30
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

		if (!category && !subCategory) {
			return res.status(400).json({ message: 'Category or SubCategory is required' })
		}

		const filter = { aproved: true }

		if (category) {
			const cat = await Category.findOne({ name: new RegExp(`^${category}$`, 'i') })
			if (!cat) {
				return res.status(404).json({ message: `Category "${category}" not found` })
			}
			filter.categoryId = cat._id
		}

		if (subCategory) {
			const subCat = await SubCategory.findOne({ name: new RegExp(`^${subCategory}$`, 'i') })
			if (!subCat) {
				return res.status(404).json({ message: `SubCategory "${subCategory}" not found` })
			}
			filter.subCategoryId = subCat._id
		}

		const total = await Product.countDocuments(filter)

		const products = await Product.find(filter)
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ [sortBy]: order })

		res.json({
			products,
			page,
			totalPages: Math.ceil(total / limit),
		})
	} catch (error) {
		console.error('Error in getCategoryProduct:', error)
		res.status(500).json({ message: error.message })
	}
}

export const getArchivedProducts = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const products = await Product.find({ user: userId, isSold: true });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeProductData = async (req, res) => {
	try {
		const { id } = req.params
		const product = await Product.findById(id)
		if (!product) {
			return res.status(404).json({ message: 'Product not found' })
		}

		if (product.user.toString() !== req.user.userId) {
			return res.status(403).json({ message: 'You are not authorized to edit this product' })
		}

		product.title = req.body.title || product.title
		product.description = req.body.description || product.description
		product.price = req.body.price || product.price
		product.amount = req.body.amount || product.amount

		if (req.body.images) {
			product.images = req.body.images
		}

		if (req.body.category) {
			const category = await Category.findOne({ name: new RegExp(`^${req.body.category}$`, 'i') })
			if (!category) {
				return res.status(400).json({ message: 'Category not found' })
			}
			product.categoryId = category._id

			if (req.body.subCategory) {
				let subCat = await SubCategory.findOne({
					name: req.body.subCategory,
					categoryId: category._id,
				})

				if (!subCat) {
					subCat = await SubCategory.create({
						name: req.body.subCategory,
						categoryId: category._id,
						approved: false,
					})
				}

				product.subCategoryId = subCat._id
			}
		}

		product.aproved = false
		await product.save()

		res.json(product)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: error.message })
	}
}
