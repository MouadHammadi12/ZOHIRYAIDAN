import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    channels: '',
    is_active: true
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'product'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    if (url && url.trim() !== '') {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return; // Prevent multiple submissions
    
    setSaving(true);
    const productData = {
      name: formData.name,
      description: formData.description,
      image: formData.image && formData.image.trim() !== '' ? formData.image : null,
      price: parseFloat(formData.price),
      channels: parseInt(formData.channels) || null,
      is_active: formData.is_active
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'product', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'product'), productData);
      }
      await loadProducts();
      setShowForm(false);
      setEditingProduct(null);
      setImagePreview(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        price: '',
        channels: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      image: product.image || '',
      price: product.price.toString(),
      channels: product.channels ? product.channels.toString() : '',
      is_active: product.is_active
    });
    setImagePreview(product.image || null);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeletingId(productId);
      try {
        await deleteDoc(doc(db, 'product', productId));
        await loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const toggleActive = async (productId) => {
    if (deletingId === productId) return; // Prevent if already deleting
    
    const product = products.find(p => p.id === productId);
    if (product) {
      try {
        await updateDoc(doc(db, 'product', productId), { is_active: !product.is_active });
        await loadProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      price: '',
      channels: '',
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button 
            className="add-product-btn"
            onClick={() => {
              setEditingProduct(null);
              setImagePreview(null);
              setFormData({
                name: '',
                description: '',
                image: '',
                price: '',
                channels: '',
                is_active: true
              });
              setShowForm(true);
            }}
          >
            + Add Product
          </button>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay" onClick={resetForm}>
          <div className="form-container" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Upload Image from Device</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <small className="file-hint">Max size: 2MB (JPG, PNG, etc.)</small>
              </div>

              <div className="form-group">
                <label>Or Enter Image URL</label>
                <input
                  type="url"
                  value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {imagePreview && (
                <div className="image-preview-container">
                  <label>Image Preview</label>
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: '' });
                      }}
                      className="remove-image-btn"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Price (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Channels</label>
                  <input
                    type="number"
                    value={formData.channels}
                    onChange={(e) => setFormData({ ...formData, channels: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="spinner-small"></div>
                      {editingProduct ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    editingProduct ? 'Update' : 'Save'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="cancel-btn"
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-list">
        {products.length > 0 ? (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Channels</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td data-label="Image">
                    {product.image ? (
                      <div className="table-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                    ) : (
                      <div className="table-image-placeholder">📺</div>
                    )}
                  </td>
                  <td data-label="Name">{product.name}</td>
                  <td data-label="Price">{product.price.toFixed(2)} €</td>
                  <td data-label="Channels">{product.channels ? product.channels.toLocaleString() : '-'}</td>
                  <td data-label="Status">
                    <button
                      onClick={() => toggleActive(product.id)}
                      className={`status-btn ${product.is_active ? 'active' : 'inactive'}`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(product)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="delete-btn"
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? (
                          <>
                            <div className="spinner-small"></div>
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-products">
            <p>No products found. Add a product to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
