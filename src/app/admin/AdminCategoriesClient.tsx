"use client";

import { useState } from "react";
import { addCategory, deleteCategory } from "./actions";

type Category = {
  id: string;
  name: string;
  created_at: string;
};

export default function AdminCategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? (Make sure no projects are currently using it)")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (e: any) {
      alert("Failed to delete category: " + e.message);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory.trim());
      alert("Category added successfully!");
      window.location.reload();
    } catch (e: any) {
      alert("Failed to add category: " + e.message);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Categories</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
        >
          {isAdding ? "Cancel" : "Add New Category"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <form onSubmit={handleAddSubmit} className="space-y-4 max-w-sm">
            <div>
              <label className="text-sm font-medium mb-1 block">Category Name</label>
              <input 
                required 
                className="w-full h-10 border rounded-md px-3 text-sm bg-background" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                placeholder="e.g. Wedding, Event, Studio" 
              />
            </div>
            <button type="submit" className="w-full bg-foreground text-background py-2 rounded-md text-sm font-medium">
              Save Category
            </button>
          </form>
        </div>
      )}

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(category.id)} 
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
