"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function Addresses() {
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      name: "Krushna Mengal",
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "Nashik",
      state: "Maharashtra",
      zip: "10001",
      country: "India",
      phone: "+91 9699050043",
      isDefault: true,
    },
    {
      id: "addr-2",
      name: "Sumit Dighe",
      line1: "456 Market St",
      line2: "",
      city: "Pune",
      state: "Maharashtra",
      zip: "94103",
      country: "India",
      phone: "+91 9699050043",
      isDefault: false,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: "",
    isDefault: false,
  })

  const handleAddAddress = () => {
    const id = `addr-${Date.now()}`
    const addressToAdd = { ...newAddress, id }

    // If this is the first address or marked as default, update other addresses
    if (addresses.length === 0 || newAddress.isDefault) {
      setAddresses((prev) => prev.map((addr) => ({ ...addr, isDefault: false })).concat(addressToAdd))
    } else {
      setAddresses((prev) => [...prev, addressToAdd])
    }

    // Reset form and close dialog
    setNewAddress({
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      phone: "",
      isDefault: false,
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Addresses</CardTitle>
          <CardDescription>Manage your shipping and billing addresses</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>Enter the details for your new address</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="line1">Address Line 1</Label>
                <Input
                  id="line1"
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                <Input
                  id="line2"
                  value={newAddress.line2}
                  onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={newAddress.country}
                    onValueChange={(value) => setNewAddress({ ...newAddress, country: value })}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="default"
                  className="rounded border-gray-300"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                />
                <Label htmlFor="default">Set as default address</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAddress}>Save Address</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {addresses.length > 0 ? (
          <div className="space-y-4">
            <RadioGroup defaultValue={addresses.find((addr) => addr.isDefault)?.id}>
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3 border rounded-lg p-4">
                  <RadioGroupItem
                    value={address.id}
                    id={address.id}
                    checked={address.isDefault}
                    onClick={() => handleSetDefault(address.id)}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Label htmlFor={address.id} className="font-medium">
                          {address.name}
                          {address.isDefault && <span className="ml-2 text-xs text-muted-foreground">(Default)</span>}
                        </Label>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div>{address.line1}</div>
                          {address.line2 && <div>{address.line2}</div>}
                          <div>
                            {address.city}, {address.state} {address.zip}
                          </div>
                          <div>{address.country}</div>
                          <div className="mt-1">{address.phone}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={address.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="text-center py-10">
            <MapPin className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium text-lg mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-4">Add an address to make checkout faster.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
