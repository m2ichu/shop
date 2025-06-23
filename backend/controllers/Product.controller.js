import Product from '../models/Product.model.js'
import Category from '../models/Categories.model.js'
import SubCategory from '../models/SubCategories.model.js'


export const createProduct = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const { title, description, price, images, amount, category, subCategory } = req.body;

    if (!title || !description || !price || !images || !amount || !category) {
      return res.status(400).json({ message: 'All fields are required (category required)' });
    }

    const foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      return res.status(400).json({ message: 'Category not found' });
    }

    let foundSubCategory = null;
    if (subCategory) {
      foundSubCategory = await SubCategory.findOne({ name: subCategory, categoryId: foundCategory._id });

      if (!foundSubCategory) {
        foundSubCategory = await SubCategory.create({
          name: subCategory,
          categoryId: foundCategory._id,
          approved: false,
        });
      }
    } else {
      return res.status(400).json({ message: 'SubCategory is required' });
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
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 30;

    const total = await Product.countDocuments();

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); 

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 30;

    if (user) {
      const owner = await User.findOne({ username: user });
      if (!owner) {
        return res.status(404).json({ message: 'User not found' });
      }

      const total = await Product.countDocuments({ user: owner._id });
      const products = await Product.find({ user: owner._id })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }); 

      return res.json({
        products,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    }

    return res.status(400).json({ message: 'No product ID or user specified' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryProduct = async (req, res) => {
  try {
    const { category, subCategory } = req.query; 
    const page = parseInt(req.query.page) || 1;
    const limit = 30;

    if (!category && !subCategory) {
      return res.status(400).json({ message: 'Category or SubCategory is required' });
    }

    const filter = {};
    if (category) filter.categoryId = category;
    if (subCategory) filter.subCategoryId = subCategory;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
