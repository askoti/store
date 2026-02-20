"use client";

import { useState } from "react";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  togglePin,
  verifyAdmin
} from "./actions";

const CATEGORIES = [
  "Charging",
  "Desk Setup",
  "Audio",
  "Travel Tech",
  "Smart Home",
  "Wearables",
  "Cables & Adapters",
  "Lighting",
  "PC & Laptops",
  "Keyboards",
  "Headphones",
  "Mice",
  "Limited",
  "Accessories"
];


const MAX_IMAGES = 8;
const MAX_FILE_SIZE_MB = 5;

export default function AdminDashboard({ initialProducts = [] }) {
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const [editImages, setEditImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");

  const filtered = initialProducts.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* --------------------------
     HANDLE NEW IMAGE SELECT
  ---------------------------*/
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";

    const totalCount = editImages.length + newImages.length + files.length;
    if (totalCount > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    const validFiles = files.filter((file) => {
      const sizeMB = file.size / 1024 / 1024;
      if (sizeMB > MAX_FILE_SIZE_MB) {
        setError(`File ${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return false;
      }

      const duplicate = newImages.some(
        (f) => f.name === file.name && f.size === file.size
      );
      return !duplicate;
    });

    setNewImages((prev) => [...prev, ...validFiles]);
    setError("");
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center font-sans relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="relative z-10 w-full max-w-sm p-8 border border-white/10 bg-black">
          <h1 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-center opacity-50 italic">System_Locked //</h1>
          <form onSubmit={async (e) => {
            e.preventDefault();
            
            // We call the Server Action instead of checking process.env here
            const res = await verifyAdmin(passInput); 

            if (res.success) { 
              setIsAuthenticated(true);
            } else {
              alert("DENIED");
              setPassInput(""); // Clear it so you can try again
            }
          }} className="space-y-4">
            <input 
              type="password" 
              placeholder="ACCESS_KEY" 
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black outline-none focus:border-[#d4ff3f] uppercase italic transition-all"
            />
            <button className="w-full bg-[#d4ff3f] text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-white transition-all">Unlock_Database</button>
          </form>
        </div>
      </main>
    );
  }

  /* --------------------------
     DRAG REORDER EXISTING
  ---------------------------*/
  const handleDrop = (index) => {
    if (dragIndex === null) return;
    const updated = [...editImages];
    const dragged = updated[dragIndex];
    updated.splice(dragIndex, 1);
    updated.splice(index, 0, dragged);
    setEditImages(updated);
    setDragIndex(null);
  };

  /* --------------------------
     RESET EDIT STATE
  ---------------------------*/
  const resetEdit = () => {
    setEditingId(null);
    setEditImages([]);
    setNewImages([]);
    setError("");
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      {/* NAV */}
      <nav className="border-b px-8 h-16 flex justify-between items-center">
        <h1 className="font-black uppercase tracking-widest">Inventory</h1>
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="border px-4 py-2 text-xs"
        />
      </nav>

      <div className="max-w-[1600px] mx-auto grid grid-cols-12">
        {/* CREATE */}
        <aside className="col-span-12 lg:col-span-3 border-r p-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsPublishing(true);
              const res = await addProduct(new FormData(e.currentTarget));
              if (res?.success) e.target.reset();
              setIsPublishing(false);
            }}
            className="space-y-4"
          >
            <input name="name" placeholder="Name" className="w-full border p-2 text-xs" required />
            <textarea name="description" placeholder="Description" className="w-full border p-2 text-xs" required />
            <input name="price" type="number" step="0.01" placeholder="Price" className="w-full border p-2 text-xs" required />
            <input name="quantity" type="number" placeholder="Quantity" className="w-full border p-2 text-xs" required />
            <input name="salePrice" type="number" step="0.01" placeholder="Sale Price" className="w-full border p-2 text-xs" />
            <select name="category" className="w-full border p-2 text-xs">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input name="imageFiles" type="file" multiple required />
            <button className="w-full bg-black text-white py-3 text-xs uppercase">
              {isPublishing ? "Processing..." : "Create"}
            </button>
          </form>
        </aside>

        {/* PRODUCTS */}
        <section className="col-span-12 lg:col-span-9 p-8 space-y-6">
          {filtered.map((product) => (
            <div key={product.id} className="border p-6">

              {editingId === product.id ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    newImages.forEach((file) => {
                      formData.append("newImages", file);
                    });
                    await updateProduct(formData);
                    resetEdit();
                  }}
                  className="space-y-6"
                >
                  <input type="hidden" name="id" value={product.id} />
                  <input
                    type="hidden"
                    name="existingImages"
                    value={JSON.stringify(editImages)}
                  />

                  {/* EXISTING IMAGES */}
                  <div>
                    <p className="text-xs font-bold mb-2">Images (Drag to reorder)</p>
                    <div className="flex gap-4 flex-wrap">
                      {editImages.map((img, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={() => setDragIndex(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(index)}
                          className="relative w-28 h-28 border group cursor-move"
                        >
                          <img src={img} className="w-full h-full object-cover" alt="" />

                          <button
                            type="button"
                            onClick={() =>
                              setEditImages(editImages.filter((_, i) => i !== index))
                            }
                            className="absolute top-1 right-1 bg-black text-white text-xs w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>

                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-white text-black text-[10px] px-2 py-1 font-bold">
                              MAIN
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NEW IMAGES */}
                  <div>
                    <input type="file" multiple onChange={handleNewImages} />
                    {error && (
                      <p className="text-red-600 text-xs mt-2">{error}</p>
                    )}

                    {newImages.length > 0 && (
                      <div className="flex gap-4 flex-wrap mt-4">
                        {newImages.map((file, index) => (
                          <div key={index} className="relative w-28 h-28 border group">
                            <img
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setNewImages(newImages.filter((_, i) => i !== index))
                              }
                              className="absolute top-1 right-1 bg-black text-white text-xs w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FIELDS */}
                  <input name="name" defaultValue={product.name} className="w-full border p-2 text-xs" />
                  <textarea name="description" defaultValue={product.description} className="w-full border p-2 text-xs" />
                  <select name="category" defaultValue={product.category} className="w-full border p-2 text-xs">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full border p-2 text-xs" />
                  <input name="salePrice" type="number" step="0.01" defaultValue={product.salePrice || ""} className="w-full border p-2 text-xs" />
                  <input name="quantity" type="number" defaultValue={product.quantity} className="w-full border p-2 text-xs" />

                  <div className="flex gap-4">
                    <button className="bg-black text-white px-6 py-2 text-xs uppercase">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={resetEdit}
                      className="text-xs uppercase"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 border">
                      {product.images?.[0] && (
                        <img src={product.images[0]} className="w-full h-full object-contain" alt="" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm uppercase">{product.name}</h3>
                      <p className="text-xs text-black/40">{product.category}</p>
                      <p className="text-xs">QTY: {product.quantity}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => togglePin(product.id, product.isPinned)}
                      className="text-xs uppercase"
                    >
                      {product.isPinned ? "Featured" : "Pin"}
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(product.id);
                        setEditImages(product.images || []);
                      }}
                      className="text-xs uppercase"
                    >
                      Edit
                    </button>

                    {confirmDeleteId === product.id ? (
                      <form action={deleteProduct} className="flex gap-2">
                        <input type="hidden" name="id" value={product.id} />
                        <button className="text-red-600 text-xs">Confirm</button>
                        <button type="button" onClick={() => setConfirmDeleteId(null)}>X</button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(product.id)}
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
