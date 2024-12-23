"use client";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Property {
  name: string;
  propertyID: string;
  grand_total: string;
}

interface PropertyDetails {
  villageName: string;
  surveyNo: string;
  subDivisionNo: string;
  taluka: string;
  totalArea: number;
  cultivableArea: {
    ker: number;
    rice: number;
    dryCrop: number;
    khzan: number;
    morad: number;
    garden: number;
  };
  uncultivableArea: {
    potKarab: number;
    classA: number;
    classB: number;
  };
  owners: {
    name: string;
    mutation: string;
    khataNo: string;
    tenants: string[];
  }[];
  croppedArea: {
    irrigatedArea: number;
    unirrigatedArea: number;
    cropName: string;
    year: number;
    season: string;
    cultivatorName: string;
    landNotAvailableForCultivation: boolean;
    sourceOfIrrigation: string;
    remarks: string;
  };
}

export default function Component() {
  const [searchType, setSearchType] = useState<'name' | 'location'>('name')
  const [properties, setProperties] = useState<Property[]>([])
  const [sortBy, setSortBy] = useState<'ASC' | 'DESC'>('ASC')
  const [minArea, setMinArea] = useState<string>('0')
  const [maxArea, setMaxArea] = useState<string>('10000')
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [searchName, setSearchName] = useState<string>('')
  const [taluka, setTaluka] = useState<string>('')
  const [villageName, setVillageName] = useState<string>('')
  const [surveyNo, setSurveyNo] = useState<string>('')
  const [subDivision, setSubDivision] = useState<string>('')
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (minArea !== '' && maxArea !== '') {
      fetchProperties()
    }
    setIsAdmin(localStorage.getItem('isAdmin') === 'true')
  }, [sortBy, minArea, maxArea])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/sortby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sortBy: sortBy.toLowerCase(), min: minArea, max: maxArea }),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const handleSearch = async () => {
    if (searchType === 'name' && !searchName.trim()) {
      console.log('Please enter a name to search');
      return;
    }
    if (searchType === 'location' && !taluka.trim() && !villageName.trim() && !surveyNo.trim() && !subDivision.trim()) {
      console.log('Please enter at least one location detail to search');
      return;
    }

    try {
      let response;
      if (searchType === 'name') {
        response = await fetch('/api/search/byname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: searchName }),
        });
      } else {
        response = await fetch('/api/search/bylocation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({taluka, villageName, surveyNo, subDivision}),
        });
      }
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setSelectedProperty(data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error searching properties:', error);
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

  const handleCardClick = async (propertyID: string) => {
    try {
      const response = await fetch('/api/search/byid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyID: propertyID }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }
      const data = await response.json();
      setSelectedProperty(data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  }

  return (
    <div className="w-full font-inter">
      <header className="relative h-[300px] bg-[url('https://cdn.midjourney.com/0f4e7da3-19f5-4f3b-a37e-f9acf4be6615/0_0.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 py-8 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl text-white font-bebas">LANDMASTER</h1>
              {isAdmin ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black font-inter">
                      Dashboard
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => window.location.href = '/api/create'}>Create Database</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/insertdata'}>Insert Data</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/deletedata'}>Delete Data</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/viewtrigger'}>View Triggers</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/api/dummy'}>Insert Dummy</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      localStorage.setItem('isAdmin', 'false');
                      setIsAdmin(false);
                    }}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black font-inter" asChild>
                  <a href="/admin">Admin</a>
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full home">
              <div className="flex gap-2">
                <Select onValueChange={(value: string) => setSearchType(value as 'name' | 'location')}>
                  <SelectTrigger className="w-[180px] border-none bg-white text-black font-bold font-inter">
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
                    className="bg-white text-black font-inter placeholder-black"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                )}
                <Button variant="secondary" className="font-inter bg-black text-white font-bold" onClick={handleSearch}>Search</Button>
              </div>
              {searchType === 'location' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Input 
                    className="bg-white border-none text-black font-inter placeholder-black" 
                    placeholder="Taluka"
                    type="text"
                    value={taluka}
                    onChange={(e) => setTaluka(e.target.value)}
                  />
                  <Input 
                    className="bg-white border-none text-black font-inter placeholder-black" 
                    placeholder="Village Name" 
                    type="text"
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                  />
                  <Input 
                    className="bg-white border-none text-black font-inter placeholder-black" 
                    placeholder="Survey No" 
                    type="number"
                    value={surveyNo}
                    onChange={(e) => setSurveyNo(e.target.value)}
                  />
                  <Input 
                    className="bg-white border-none text-black font-inter placeholder-black" 
                    placeholder="Sub Division" 
                    type="number"
                    value={subDivision}
                    onChange={(e) => setSubDivision(e.target.value)}
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
            <Card key={index} className="h-[350px] flex flex-col cursor-pointer" onClick={() => handleCardClick(property.propertyID)}>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="font-inter text-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Property Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow overflow-y-auto">
            <DialogDescription>
              {selectedProperty && (
                <div>
                  <p><strong>Village Name:</strong> {selectedProperty.villageName}</p>
                  <p><strong>Survey No:</strong> {selectedProperty.surveyNo}</p>
                  <p><strong>Sub Division No:</strong> {selectedProperty.subDivisionNo}</p>
                  <p><strong>Taluka:</strong> {selectedProperty.taluka}</p>
                  <p><strong>Total Area:</strong> {selectedProperty.totalArea} sq m</p>
                  <h3 className="text-xl font-bold mt-4 mb-2">Cultivable Area:</h3>
                  <ul>
                    <li>Ker: {selectedProperty.cultivableArea.ker} sq m</li>
                    <li>Rice: {selectedProperty.cultivableArea.rice} sq m</li>
                    <li>Dry Crop: {selectedProperty.cultivableArea.dryCrop} sq m</li>
                    <li>Khzan: {selectedProperty.cultivableArea.khzan} sq m</li>
                    <li>Morad: {selectedProperty.cultivableArea.morad} sq m</li>
                    <li>Garden: {selectedProperty.cultivableArea.garden} sq m</li>
                  </ul>
                  <h3 className="text-xl font-bold mt-4 mb-2">Uncultivable Area:</h3>
                  <ul>
                    <li>Pot Karab: {selectedProperty.uncultivableArea.potKarab} sq m</li>
                    <li>Class A: {selectedProperty.uncultivableArea.classA} sq m</li>
                    <li>Class B: {selectedProperty.uncultivableArea.classB} sq m</li>
                  </ul>
                  <h3 className="text-xl font-bold mt-4 mb-2">Owners:</h3>
                  {selectedProperty.owners.map((owner, index) => (
                    <div key={index}>
                      <p>Name: {owner.name}</p>
                      <p>Mutation: {owner.mutation}</p>
                      <p>Khata No: {owner.khataNo}</p>
                      <p>Tenants: {owner.tenants.join(', ')}</p>
                    </div>
                  ))}
                  <h3 className="text-xl font-bold mt-4 mb-2">Cropped Area:</h3>
                  <p>Irrigated Area: {selectedProperty.croppedArea.irrigatedArea} sq m</p>
                  <p>Unirrigated Area: {selectedProperty.croppedArea.unirrigatedArea} sq m</p>
                  <p>Crop Name: {selectedProperty.croppedArea.cropName}</p>
                  <p>Year: {selectedProperty.croppedArea.year}</p>
                  <p>Season: {selectedProperty.croppedArea.season}</p>
                  <p>Cultivator Name: {selectedProperty.croppedArea.cultivatorName}</p>
                  <p>Land Not Available For Cultivation: {selectedProperty.croppedArea.landNotAvailableForCultivation ? 'Yes' : 'No'}</p>
                  <p>Source of Irrigation: {selectedProperty.croppedArea.sourceOfIrrigation}</p>
                  <p>Remarks: {selectedProperty.croppedArea.remarks}</p>
                </div>
              )}
            </DialogDescription>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}