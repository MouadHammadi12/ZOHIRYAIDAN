import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useProducts } from '../contexts/ProductsContext';
import './AdminDashboard.css';

const ProductCardItem = React.memo(({ product, onEdit, onDelete, onToggleActive, deletingId }) => (
  <div className="product-card">
    <div className="card-header">
      {product.image ? (
        <img src={product.image} alt={product.name} className="card-image" />
      ) : (
        <div className="card-image-placeholder">📺</div>
      )}
      <div className="card-title-section">
        <h3 className="card-title">{product.name}</h3>
        <span className="card-price">{product.price.toFixed(2)} €</span>
      </div>
    </div>
    
    <div className="card-body">
      {product.description && (
        <p className="card-description">{product.description}</p>
      )}
      <div className="card-details">
        <span className="card-channels">
          Channels: {product.channels ? product.channels.toLocaleString() : '-'}
        </span>
        <button
          onClick={() => onToggleActive(product.id)}
          className={`status-btn ${product.is_active ? 'active' : 'inactive'}`}
        >
          {product.is_active ? 'Active' : 'Inactive'}
        </button>
      </div>
    </div>

    <div className="card-actions">
      <button
        onClick={() => onEdit(product)}
        className="edit-btn"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(product.id)}
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
  </div>
));

const AdminDashboard = React.memo(({ onLogout }) => {
  const { products, loading: globalLoading, refreshProducts } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [totalVisits, setTotalVisits] = useState(0);
  const [showProducts, setShowProducts] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    channels: '',
    is_active: true
  });

  useEffect(() => {
    // Products are loaded globally by ProductsProvider
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 968);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const stats = useMemo(() => {
    if (globalLoading) return { totalProducts: 0, activeProducts: 0, totalVisits: 0 };
    const total = products.length;
    const active = products.filter(p => p.is_active).length;
    return { totalProducts: total, activeProducts: active, totalVisits };
  }, [products, globalLoading, totalVisits]);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const docRef = doc(db, 'stats', 'visits');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTotalVisits(docSnap.data().count || 0);
        }
      } catch (error) {
        console.error('Error fetching visits:', error);
      }
    };
    fetchVisits();
  }, []);

  // Remove local loadProducts function since we use global state

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
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
        setFormData(prev => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageUrlChange = useCallback((e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));
    if (url && url.trim() !== '') {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    console.log('handleSubmit called, editingProduct:', editingProduct);
    if (saving) return; // Prevent multiple submissions
    
    setSaving(true);
    const productData = {
      name: formData.name,
      description: formData.description,
      image: formData.image && formData.image.trim() !== '' ? formData.image : null,
      price: parseFloat(formData.price),
      channels: parseInt(formData.channels) || null,
      is_active: Boolean(formData.is_active)
    };

    try {
      if (editingProduct) {
        console.log('Updating product:', editingProduct.id, productData);
        
        // Check if document exists first
        const docRef = doc(db, 'product', editingProduct.id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error('Product not found in database. It may have been deleted.');
        }
        
        await updateDoc(docRef, productData);
        console.log('Product updated successfully');
      } else {
        console.log('Adding new product:', productData);
        await addDoc(collection(db, 'product'), productData);
        console.log('Product added successfully');
      }
      await refreshProducts();
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
      // Notify Home page to refresh (though it should auto-refresh via context)
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + error.message);
    } finally {
      setSaving(false);
    }
  }, [saving, editingProduct, formData, refreshProducts]);

  const handleEdit = useCallback((product) => {
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
  }, []);

  const handleDelete = useCallback(async (productId) => {
    console.log('handleDelete called with productId:', productId);
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeletingId(productId);
      try {
        console.log('Deleting product:', productId);
        
        // Check if document exists first
        const docRef = doc(db, 'product', productId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error('Product not found in database. It may have already been deleted.');
        }
        
        await deleteDoc(docRef);
        console.log('Product deleted successfully');
        await refreshProducts();
        // Notify Home page to refresh (though it should auto-refresh via context)
        window.dispatchEvent(new Event('productsUpdated'));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  }, [refreshProducts]);

  const clearAllProducts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'product'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('All products cleared');
      await refreshProducts();
      // Notify Home page to refresh (though it should auto-refresh via context)
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error) {
      console.error('Error clearing products:', error);
      alert('Error clearing products: ' + error.message);
    }
  }, [refreshProducts]);

  const toggleProducts = useCallback(() => {
    setShowProducts(prev => !prev);
  }, []);

  const toggleActive = useCallback(async (productId) => {
    if (deletingId === productId) return; // Prevent if already deleting
    
    const product = products.find(p => p.id === productId);
    if (product) {
      try {
        // Check if document exists first
        const docRef = doc(db, 'product', productId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error('Product not found in database.');
        }
        
        await updateDoc(docRef, { is_active: Boolean(!product.is_active) });
        await refreshProducts();
        // Notify Home page to refresh (though it should auto-refresh via context)
        window.dispatchEvent(new Event('productsUpdated'));
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product status: ' + error.message);
      }
    }
  }, [deletingId, products, refreshProducts]);

  const resetForm = useCallback(() => {
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
  }, []);

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
          <button 
            className="refresh-btn"
            onClick={() => refreshProducts()}
          >
             Refresh
          </button>
          <button 
            className="clear-btn"
            onClick={() => {
              if (window.confirm('This will delete ALL products from the database. Are you sure?')) {
                clearAllProducts();
              }
            }}
          >
             Delete All
          </button>
          <button 
            className="toggle-btn"
            onClick={toggleProducts}
          >
            {showProducts ? 'Hide Products' : 'Show Products'}
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
                <small className="file-hint">Max size: 5MB (JPG, PNG, etc.)</small>
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

      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Active Products</h3>
          <p>{stats.activeProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Visits</h3>
          <p>{stats.totalVisits}</p>
        </div>
      </div>

      {showProducts && (
        <div className="products-list">
          {globalLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
        ) : products.length > 0 ? (
          isMobile ? (
            <div className="products-cards">
              {products.map((product) => (
                <ProductCardItem
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={toggleActive}
                  deletingId={deletingId}
                />
              ))}
            </div>
          ) : (
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
          )
        ) : (
          <div className="no-products">
            <p>No products found. Add a product to get started.</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
});

export default AdminDashboard;
