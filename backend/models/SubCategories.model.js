import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  aproved: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default mongoose.model("SubCategory", subCategorySchema);
