"use client";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Property {
  name: string;
  propertyID: string;
  grand_total: string;
}

export default function Component() {
  const [searchType, setSearchType] = useState<'name' | 'location'>('name')
  const [properties, setProperties] = useState<Property[]>([])
  const [sortBy, setSortBy] = useState<'ASC' | 'DESC'>('ASC')
  const [minArea, setMinArea] = useState<string>('1')
  const [maxArea, setMaxArea] = useState<string>('1000')

  useEffect(() => {
    fetchProperties()
  }, [sortBy, minArea, maxArea])

  const fetchProperties = async () => {
    try {
      let response;
      if (minArea !== '' && maxArea !== '') {
        response = await fetch('/api/minmax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ min: minArea, max: maxArea }),
        })
      } else {
        response = await fetch('/api/sortby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sortBy: sortBy.toLowerCase() }),
        })
      }
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const handleMinAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinArea(e.target.value)
  }

  const handleMaxAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxArea(e.target.value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value.toUpperCase() as 'ASC' | 'DESC')
  }

  return (
    <div className="w-full font-inter">
      <header className="relative h-[300px] bg-[url('https://cdn.midjourney.com/0f4e7da3-19f5-4f3b-a37e-f9acf4be6615/0_0.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 py-8 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl text-white font-bebas">LANDMASTER</h1>
              <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black font-inter">
                Admin
              </Button>
            </div>
            <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full home">
              <div className="flex gap-2">
                <Select onValueChange={(value: string) => setSearchType(value as 'name' | 'location')}>
                  <SelectTrigger className="w-[180px] border-none bg-white bg-opacity-20 text-black font-bold font-inter">
                    <SelectValue placeholder="Search by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
                {searchType === 'name' && (
                  <Input
                    placeholder="Enter Owner's Name"
                    className="bg-white bg-opacity-20 text-black font-inter placeholder-black"
                  />
                )}
                <Button variant="secondary" className="font-inter bg-black text-white font-bold">Search</Button>
              </div>
              {searchType === 'location' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Input 
                    className="bg-white border-none bg-opacity-20 text-black font-inter placeholder-black" 
                    placeholder="Taluka"
                    type="text"
                  />
                  <Input 
                    className="bg-white border-none bg-opacity-20 text-black font-inter placeholder-black" 
                    placeholder="Village Name" 
                    type="text"
                  />
                  <Input 
                    className="bg-white border-none bg-opacity-20 text-black font-inter placeholder-black" 
                    placeholder="Survey No" 
                    type="number"
                  />
                  <Input 
                    className="bg-white border-none bg-opacity-20 text-black font-inter placeholder-black" 
                    placeholder="Sub Division" 
                    type="number"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 font-inter">
        <h2 className="text-2xl font-bold mb-4 font-inter">Available Properties</h2>
        <div className="mb-4 flex items-end gap-4">
          <div>
            <h3 className="font-semibold mb-2 font-inter">Total Area Size</h3>
            <div className="flex gap-4">
              <div>
                <label htmlFor="min-area" className="text-sm font-inter text-gray-600">Minimum</label>
                <Input id="min-area" placeholder="1m²" className="w-24" value={minArea} onChange={handleMinAreaChange} />
              </div>
              <div>
                <label htmlFor="max-area" className="text-sm font-inter text-gray-600">Maximum</label>
                <Input id="max-area" className="w-24" placeholder="1000m²" value={maxArea} onChange={handleMaxAreaChange} />
              </div>
            </div>
          </div>
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] font-inter">
              <SelectValue placeholder="Sort Name by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property,index) => (
            <Card key={index} className="h-[350px] flex flex-col">
              <img
                src="https://cdn.midjourney.com/17d53012-ec3a-4dc7-9fdf-a8d2fc02e999/0_0.png"
                alt="Scenic landscape"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4 font-inter flex-grow flex flex-col justify-between">
                <div>
                  <p><strong>Owner Name:</strong> {property.name}</p>
                  <p><strong>Property ID:</strong> {property.propertyID}</p>
                  <p><strong>Total Area</strong></p>
                </div>
                <Button className="w-full mt-2 bg-black text-white hover:bg-gray-800" variant="secondary">
                  {parseFloat(property.grand_total).toFixed(2)}m²
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}