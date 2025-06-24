import Product from '../models/Product.model.js'
import SubCategory from '../models/SubCategories.model.js'

export const getAllNotAprovedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;

    const filter = { aproved: false };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllNotAprovedSubCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;

    const filter = { approved: false };

    const total = await SubCategory.countDocuments(filter);

    const subCategories = await SubCategory.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      subCategories,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    product.aproved = true
    await product.save()
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const approveSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    subCategory.approved = true;
    await subCategory.save();

    res.status(200).json({ message: 'SubCategory approved', subCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const editSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    if (name) subCategory.name = name;
    if (categoryId) subCategory.categoryId = categoryId;
    subCategory.approved = false; 

    await subCategory.save();
    res.status(200).json({ message: 'SubCategory updated', subCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    res.status(200).json({ message: 'SubCategory deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
