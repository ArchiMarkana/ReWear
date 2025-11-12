import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaUpload, FaImage, FaTag, FaRuler, FaPalette, FaInfo, FaSave, FaTimes } from "react-icons/fa";
import "./ProductUpload.css";

export default function ProductUpload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    originalPrice: "",
    discount: "",
    size: "",
    color: "",
    condition: "",
    material: "",
    gender: "unisex",
    stock: "1"
  });

  const categories = {
    clothing: {
      name: "Clothing",
      subcategories: ["Tops", "Bottoms", "Dresses", "Outerwear", "Activewear", "Sleepwear", "Underwear", "Swimwear"]
    },
    footwear: {
      name: "Footwear", 
      subcategories: ["Sneakers", "Boots", "Sandals", "Heels", "Flats", "Athletic", "Casual", "Formal"]
    },
    bags: {
      name: "Bags & Accessories",
      subcategories: ["Handbags", "Backpacks", "Totes", "Clutches", "Crossbody", "Travel", "Wallets", "Belts"]
    },
    jewelry: {
      name: "Jewelry",
      subcategories: ["Necklaces", "Earrings", "Bracelets", "Rings", "Watches", "Brooches", "Anklets", "Chains"]
    },
    accessories: {
      name: "Accessories",
      subcategories: ["Hats", "Scarves", "Gloves", "Sunglasses", "Hair Accessories", "Phone Cases", "Keychains", "Pins"]
    },
    watches: {
      name: "Watches",
      subcategories: ["Digital", "Analog", "Smart", "Sports", "Dress", "Vintage", "Luxury", "Casual"]
    },
    eyewear: {
      name: "Eyewear",
      subcategories: ["Sunglasses", "Prescription", "Reading", "Blue Light", "Sports", "Fashion", "Vintage", "Designer"]
    },
    electronics: {
      name: "Electronics",
      subcategories: ["Phones", "Laptops", "Tablets", "Headphones", "Cameras", "Gaming", "Audio", "Accessories"]
    },
    home: {
      name: "Home & Living",
      subcategories: ["Furniture", "Decor", "Kitchen", "Bedding", "Bath", "Garden", "Storage", "Lighting"]
    },
    beauty: {
      name: "Beauty & Personal Care",
      subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrance", "Tools", "Bath & Body", "Men's Grooming", "Natural"]
    },
    sports: {
      name: "Sports & Fitness",
      subcategories: ["Athletic Wear", "Equipment", "Shoes", "Accessories", "Outdoor", "Gym", "Water Sports", "Winter Sports"]
    }
  };

  const conditions = [
    { value: "new", label: "New with tags" },
    { value: "like-new", label: "Like new (worn 1-2 times)" },
    { value: "good", label: "Good (minor wear)" },
    { value: "fair", label: "Fair (visible wear)" }
  ];

  const genders = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "unisex", label: "Unisex" },
    { value: "kids", label: "Kids" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file,
          isPrimary: prev.length === 0 // First image is primary by default
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const newImages = prev.filter(img => img.id !== imageId);
      // If we removed the primary image, make the first remaining image primary
      if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const setPrimaryImage = (imageId) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    })));
  };

  const calculateDiscount = () => {
    const price = parseFloat(formData.price);
    const originalPrice = parseFloat(formData.originalPrice);
    if (price && originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.subcategory || 
        !formData.price || !formData.size || !formData.color || !formData.condition) {
      setError("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one image!");
      setLoading(false);
      return;
    }

    try {
      // Prepare form data for upload
      const uploadData = new FormData();
      
      // Add product details
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('subcategory', formData.subcategory);
      uploadData.append('price', formData.price);
      uploadData.append('originalPrice', formData.originalPrice || formData.price);
      uploadData.append('discount', calculateDiscount());
      uploadData.append('size', formData.size);
      uploadData.append('color', formData.color);
      uploadData.append('condition', formData.condition);
      uploadData.append('material', formData.material);
      uploadData.append('gender', formData.gender);
      uploadData.append('stock', formData.stock);

      // Add images
      images.forEach((image, index) => {
        uploadData.append('images', image.file);
        if (image.isPrimary) {
          uploadData.append('primaryImageIndex', index);
        }
      });

      const token = localStorage.getItem('sellerToken');
      const response = await fetch('http://localhost:5000/api/seller/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product uploaded successfully!");
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          subcategory: "",
          price: "",
          originalPrice: "",
          discount: "",
          size: "",
          color: "",
          condition: "",
          material: "",
          gender: "unisex",
          stock: "1"
        });
        setImages([]);
        setTimeout(() => {
          navigate('/seller/dashboard');
        }, 2000);
      } else {
        setError(data.message || "Failed to upload product");
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError("Failed to upload product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-upload-root">
      <Header />
      
      <div className="product-upload-container">
        <div className="upload-header">
          <h1>Upload New Product</h1>
          <p>Add your product details and images to start selling</p>
        </div>

        {error && (
          <div className="error-message">
            <FaTimes />
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <FaSave />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaTag className="label-icon" />
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaInfo className="label-icon" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.entries(categories).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaTag className="label-icon" />
                  Subcategory *
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                  disabled={!formData.category}
                >
                  <option value="">Select Subcategory</option>
                  {formData.category && categories[formData.category]?.subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaPalette className="label-icon" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {genders.map(gender => (
                    <option key={gender.value} value={gender.value}>{gender.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaInfo className="label-icon" />
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describe your product in detail..."
                rows="4"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Pricing & Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">₹</span>
                  Selling Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">₹</span>
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {formData.originalPrice && formData.price && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                  <p className="discount-preview" style={{ color: 'green', fontWeight: 'bold' }}>
                    You save: {calculateDiscount()}%
                  </p>
                )}
                {formData.originalPrice && formData.price && parseFloat(formData.originalPrice) <= parseFloat(formData.price) && parseFloat(formData.originalPrice) !== parseFloat(formData.price) && (
                  <p className="discount-preview" style={{ color: 'orange' }}>
                    Original price should be higher than selling price
                  </p>
                )}
                {formData.originalPrice && formData.price && parseFloat(formData.originalPrice) === parseFloat(formData.price) && (
                  <p className="discount-preview" style={{ color: 'gray' }}>
                    No discount (Original price equals selling price)
                  </p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaRuler className="label-icon" />
                  Size *
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., M, L, XL, 10, 42"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaPalette className="label-icon" />
                  Color *
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Red, Blue, Black"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaInfo className="label-icon" />
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Condition</option>
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>{condition.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaInfo className="label-icon" />
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Cotton, Leather, Polyester"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaInfo className="label-icon" />
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="form-input"
                placeholder="1"
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Product Images</h2>
            <p className="section-description">Upload up to 5 images. First image will be the primary image.</p>
            
            <div className="image-upload-area">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="image-input"
              />
              <label htmlFor="image-upload" className="upload-button">
                <FaUpload />
                <span>Choose Images</span>
                <small>Max 5 images, 5MB each</small>
              </label>
            </div>

            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div key={image.id} className={`image-preview ${image.isPrimary ? 'primary' : ''}`}>
                    <img src={image.url} alt={`Preview ${index + 1}`} />
                    <div className="image-overlay">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          className="set-primary-btn"
                          onClick={() => setPrimaryImage(image.id)}
                        >
                          Set Primary
                        </button>
                      )}
                      {image.isPrimary && (
                        <span className="primary-badge">Primary</span>
                      )}
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(image.id)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/seller/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FaSave />
                  Upload Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}
