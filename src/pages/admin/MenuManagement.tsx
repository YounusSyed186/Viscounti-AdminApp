"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, X, ChevronLeft, ChevronRight, Edit, ImageIcon, Loader2 } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  available: boolean;
}

interface FormDataType {
  _id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: File | string;
}

const API_URL = `${import.meta.env.VITE_BACKEND_URI}api/menu`;

// Category enums with display names
const categories = [
  { id: "pizze-tradizionali", name: "pizze-tradizionali" },
  { id: "pizze-speciali", name: "pizze-speciali" },
  { id: "calzoni", name: "calzoni" },
  { id: "kebab-panini", name: "kebab-panini" },
  { id: "burgers", name: "Burgers" },
  { id: "bibite", name: "bibite" },
  { id: "fritte", name: "fritte" },
  { id: "Indian cuisine", name: "Indian cuisine" },
  { id: "dolco", name: "dolco" },
];

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
    price: "",
    category: "pizze-tradizionali",
    image: ""
  });

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(0);

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(API_URL);
        const items = Object.values(res.data.groupedItems).flat();
        setMenuItems(items as MenuItem[]);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Add/Edit menu item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("category", formData.category);

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      let res;
      if (formData._id) {
        // Edit mode
        res = await axios.put(`${API_URL}/${formData._id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMenuItems(menuItems.map(item => item._id === formData._id ? res.data : item));
      } else {
        // Add mode
        res = await axios.post(API_URL, payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMenuItems([...menuItems, res.data]);
      }

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error adding/updating item:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete item
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "pizze-tradizionali",
      image: ""
    });
    setImagePreview(null);
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // Edit item
  const handleEdit = (item: MenuItem) => {
    setFormData({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image
    });
    setImagePreview(item.image);
    setShowForm(true);
  };

  // Filter items
  const filteredItems = filterCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === filterCategory);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select
            className="border px-3 py-2 rounded-md w-full sm:w-48 bg-gold text-black"
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(0); }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <Button 
            onClick={() => setShowForm(true)} 
            className="flex items-center gap-2 bg-gold text-black hover:bg-gold-dark"
          >
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex justify-between items-center">
              {formData._id ? "Edit Menu Item" : "Add Menu Item"}
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input
                      placeholder="Item name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                      placeholder="Item description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Price</label>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="border rounded-md px-3 py-2 w-full bg-gold text-black"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Image</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="h-20 w-20 object-cover rounded-md mb-2"
                            />
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">Click to upload</p>
                            </>
                          )}
                        </div>
                        <Input 
                          type="file" 
                          className="hidden" 
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between">
                  <div className="p-4 border rounded-md bg-gold text-black hover:bg-gold-dark">
                    <h3 className="font-medium mb-2">Preview</h3>
                    <div className="space-y-2">
                      <p className="font-semibold">{formData.name || "Item name"}</p>
                      <p className="text-sm text-gray-600">{formData.description || "Item description"}</p>
                      <p className="font-medium">{formData.price ? `£${formData.price}` : "£0.00"}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {categories.find(c => c.id === formData.category)?.name || "Category"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1 gap-2 bg-gold text-black hover:bg-gold-dark" 
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {formData._id ? "Update" : "Add"} Item
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Menu Items */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2">Loading menu items...</span>
        </div>
      ) : (
        <div className="relative">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500">No menu items found.</p>
              <Button 
                onClick={() => setShowForm(true)} 
                className="mt-4 bg-gold text-black hover:bg-gold-dark"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Your First Item
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedItems.map(item => (
                  <Card key={item._id} className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-48 w-full object-cover" 
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <span className="font-semibold text-green-700">£{item.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                          {categories.find(c => c.id === item.category)?.name || item.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Button>
                  <span className="mx-2 text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                    disabled={page === totalPages - 1}
                    className="gap-1"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;