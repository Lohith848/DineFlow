"use client"

import { useEffect, useState } from "react"
import { getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } from "@/lib/actions/menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Package,
} from "lucide-react"
import type { MenuItem } from "@/lib/types"

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    const items = await getAllMenuItems()
    setMenuItems(items)
    setLoading(false)
  }

  const handleAdd = async (formData: FormData) => {
    setSaving(true)
    const result = await addMenuItem(formData)
    if (result?.success) {
      setShowAddForm(false)
      loadMenu()
    }
    setSaving(false)
  }

  const handleUpdate = async (formData: FormData) => {
    setSaving(true)
    const result = await updateMenuItem(formData)
    if (result?.success) {
      setEditingItem(null)
      loadMenu()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setDeletingId(id)
      await deleteMenuItem(id)
      loadMenu()
      setDeletingId(null)
    }
  }

  const handleToggleAvailability = async (id: string, is_available: boolean) => {
    await toggleMenuItemAvailability(id, !is_available)
    loadMenu()
  }

  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || "Other"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Menu Items</h1>
            <p className="text-muted-foreground">Add, edit, or remove menu items</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {menuItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No menu items yet</p>
              <Button onClick={() => setShowAddForm(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-lg font-bold">{category}</h2>
                  <Badge variant="secondary">{items.length} items</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold truncate">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <Badge variant={item.is_available ? "default" : "secondary"} className="shrink-0">
                            {item.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">₹{item.price}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleAvailability(item.id, item.is_available)}
                            >
                              <div className={`w-3 h-3 rounded-full ${item.is_available ? "bg-green-500" : "bg-gray-300"}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <form action={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Name</Label>
                <Input name="name" id="add-name" required placeholder="Item name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-price">Price (₹)</Label>
                <Input name="price" id="add-price" type="number" required placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea name="description" id="add-description" placeholder="Optional description" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-category">Category</Label>
              <Input name="category" id="add-category" placeholder="e.g., Main Course, Snacks" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-image">Image URL</Label>
              <Input name="image_url" id="add-image" placeholder="https://..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form action={handleUpdate} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input name="name" id="edit-name" defaultValue={editingItem.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input name="price" id="edit-price" type="number" defaultValue={editingItem.price} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea name="description" id="edit-description" defaultValue={editingItem.description || ""} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input name="category" id="edit-category" defaultValue={editingItem.category || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input name="image_url" id="edit-image" defaultValue={editingItem.image_url || ""} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_available"
                  id="edit-available"
                  defaultChecked={editingItem.is_available}
                  className="h-4 w-4"
                />
                <Label htmlFor="edit-available">Available</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}