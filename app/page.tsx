"use client";
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export default function Component() {
  const [searchType, setSearchType] = useState<'name' | 'location'>('name')

  return (
    <div className="w-full">
      <header className="relative h-[300px] bg-[url('/placeholder.svg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 py-8 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-white">LANDMASTER</h1>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                Admin
              </Button>
            </div>
            <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full">
              <div className="flex gap-2">
                <Select onValueChange={(value: string) => setSearchType(value as 'name' | 'location')}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Search by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
                {searchType === 'name' && (
                  <Input className="flex-grow bg-white" placeholder="Enter Owner's Name" />
                )}
                <Button variant="secondary">Search</Button>
              </div>
              {searchType === 'location' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Input className="bg-white" placeholder="Taluka" />
                  <Input className="bg-white" placeholder="Village Name" />
                  <Input className="bg-white" placeholder="Survey No" />
                  <Input className="bg-white" placeholder="Sub Division" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Total Area Size</h3>
          <div className="flex gap-4">
            <div>
              <label htmlFor="min-area" className="text-sm text-gray-600">Minimum</label>
              <Input id="min-area" placeholder="1m²" className="w-24" />
            </div>
            <div>
              <label htmlFor="max-area" className="text-sm text-gray-600">Maximum</label>
              <Input id="max-area" className="w-24" placeholder="Max area" />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Image
                src="/placeholder.svg"
                alt="Scenic landscape"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <p><strong>Owner Name:</strong> Reuben Fernandes</p>
                <p><strong>Property ID:</strong> abg231bagda</p>
                <p><strong>Total Area</strong></p>
                <Button className="w-full mt-2" variant="secondary">400m²</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}