"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  Upload,
  X,
  Loader2,
  Trash2,
} from "lucide-react";

// ✅ Backend URL
const API_URL = `${import.meta.env.VITE_BACKEND_URI}api`;

interface MenuImage {
  _id: string;
  imageUrl: string;
  createdAt: string;
}

const MenuImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [menuImages, setMenuImages] = useState<MenuImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Fetch images on mount
  useEffect(() => {
    fetchMenuImages();
  }, []);

  const fetchMenuImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get<MenuImage[]>(`${API_URL}/images`);
      setMenuImages(response.data);
    } catch (error: any) {
      console.error("Error fetching images:", error);
      setMessage("Error fetching images");
      setUploadStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        setMessage("Please select an image file (JPG, PNG, WEBP)");
        setUploadStatus("error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image must be less than 5MB");
        setUploadStatus("error");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);

      setUploadStatus("idle");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image first");
      setUploadStatus("error");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("image", image);

      await axios.post(`${API_URL}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Image uploaded successfully!");
      setUploadStatus("success");
      fetchMenuImages();

      setTimeout(() => {
        setImage(null);
        setImagePreview(null);
        setUploadStatus("idle");
        setMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setMessage(err.response?.data?.message || "Upload failed");
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeletingId(id);

    try {
      await axios.delete(`${API_URL}/images/${id}`);
      setMessage("Image deleted successfully!");
      setUploadStatus("success");
      fetchMenuImages();

      setTimeout(() => {
        setUploadStatus("idle");
        setMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("Error deleting image:", err);
      setMessage(err.response?.data?.message || "Delete failed");
      setUploadStatus("error");
    } finally {
      setDeletingId(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setUploadStatus("idle");
    setMessage("");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Menu Image Management</h1>
        <p className="text-gray-600 mt-2">
          Upload and manage images of your physical menu that will be displayed
          to customers.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload New Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 object-contain rounded-md mb-4"
                />
                <Button
                  variant="outline"
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-2" /> Remove
                </Button>
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Drag & drop or click to upload</p>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                <label htmlFor="image-upload">
                  <Button asChild variant="outline" disabled={uploading}>
                    <span>
                      <Upload className="w-4 h-4 mr-2" /> Select Image
                    </span>
                  </Button>
                </label>
              </>
            )}
          </div>

          {message && (
            <div
              className={`p-3 rounded-md ${
                uploadStatus === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : uploadStatus === "error"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {message}
            </div>
          )}

          {imagePreview && (
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Upload Image
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Images ({menuImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : menuImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuImages.map((img) => (
                <div
                  key={img._id}
                  className="border rounded-lg overflow-hidden relative group hover:shadow-md transition-shadow"
                >
                  <img
                    src={img.imageUrl}
                    alt={`Uploaded on ${formatDate(img.createdAt)}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-500">
                      Uploaded: {formatDate(img.createdAt)}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(img._id)}
                      disabled={deletingId === img._id}
                    >
                      {deletingId === img._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No images yet</p>
              <p className="text-gray-400 mt-2 text-sm">
                Upload your first image to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuImageUpload;
