"use client"

import { useState } from "react"
import { PlusCircle, HelpCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AdminPage() {
  const [owners, setOwners] = useState([{ id: 1, tenants: [{ id: 1 }] }])
  const [croppedAreas, setCroppedAreas] = useState([{ id: 1 }])

  const addOwner = () => {
    setOwners([...owners, { id: Date.now(), tenants: [] }])
  }

  const addTenant = (ownerId: number) => {
    setOwners(
      owners.map((owner) =>
        owner.id === ownerId
          ? { ...owner, tenants: [...owner.tenants, { id: Date.now() }] }
          : owner
      )
    )
  }

  const addCroppedArea = () => {
    setCroppedAreas([...croppedAreas, { id: Date.now() }])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <nav>
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>Dashboard</li>
              <ChevronRight className="h-4 w-4" />
              <li className="font-medium text-gray-900">Property Management</li>
            </ol>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form className="space-y-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="property-details">
              <AccordionTrigger className="text-xl font-semibold">
                Property Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="property-name">Property Name *</Label>
                    <Input id="property-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-address">Address *</Label>
                    <Input id="property-address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-city">City *</Label>
                    <Input id="property-city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-state">State *</Label>
                    <Input id="property-state" required />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owners">
              <AccordionTrigger className="text-xl font-semibold">
                Owners
              </AccordionTrigger>
              <AccordionContent>
                {owners.map((owner, index) => (
                  <div key={owner.id} className="mb-6 p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Owner {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`owner-name-${owner.id}`}>Name *</Label>
                        <Input id={`owner-name-${owner.id}`} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`owner-email-${owner.id}`}>Email *</Label>
                        <Input id={`owner-email-${owner.id}`} type="email" required />
                      </div>
                    </div>
                    <h4 className="text-md font-medium mb-2">Tenants</h4>
                    {owner.tenants.map((tenant, tIndex) => (
                      <div key={tenant.id} className="mb-4 p-3 bg-gray-50 rounded">
                        <h5 className="text-sm font-medium mb-2">Tenant {tIndex + 1}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`tenant-name-${owner.id}-${tenant.id}`}>Name</Label>
                            <Input id={`tenant-name-${owner.id}-${tenant.id}`} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`tenant-contact-${owner.id}-${tenant.id}`}>Contact</Label>
                            <Input id={`tenant-contact-${owner.id}-${tenant.id}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => addTenant(owner.id)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Tenant
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addOwner}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Owner
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cropped-areas">
              <AccordionTrigger className="text-xl font-semibold">
                Cropped Areas
              </AccordionTrigger>
              <AccordionContent>
                {croppedAreas.map((area, index) => (
                  <div key={area.id} className="mb-6 p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Cropped Area {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`crop-type-${area.id}`}>Crop Type *</Label>
                        <Input id={`crop-type-${area.id}`} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`area-size-${area.id}`}>Area Size (acres) *</Label>
                        <Input id={`area-size-${area.id}`} type="number" required />
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Save Property</Button>
          </div>
        </form>
      </main>
    </div>
  )
}
