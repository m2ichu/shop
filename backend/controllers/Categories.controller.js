import Category from '../models/Categories.model.js'

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
