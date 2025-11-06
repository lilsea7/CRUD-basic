const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const { name, code, medias, price, amount } = req.body;

    if (!name || !code || !medias || price === undefined || amount === undefined) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const productExists = await Product.findOne({ code });
    if (productExists) {
      return res.status(400).json({ message: 'Mã sản phẩm đã tồn tại' });
    }

    const product = await Product.create({
      name, code: code.toUpperCase(), medias, price, amount
    });

    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      data: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      message: 'Lấy danh sách thành công',
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json({
      message: 'Lấy sản phẩm thành công',
      data: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log('PATCH /:id - Body:', req.body);
    const updates = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (updates.code !== undefined && updates.code !== product.code) {
      const codeExists = await Product.findOne({ code: updates.code });
      if (codeExists) {
        return res.status(400).json({ message: 'Mã sản phẩm đã tồn tại' });
      }
    }

    product.name = updates.name ?? product.name;
    product.code = updates.code !== undefined ? updates.code.toUpperCase() : product.code;
    product.medias = updates.medias ?? product.medias;
    product.price = updates.price ?? product.price;
    product.amount = updates.amount ?? product.amount;

    const updatedProduct = await product.save();

    res.json({
      message: 'Cập nhật thành công',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    await product.deleteOne();
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};