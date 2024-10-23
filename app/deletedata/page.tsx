'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from 'next/link';

export default function DeleteData() {
  const router = useRouter();
  const [deleteMethod, setDeleteMethod] = useState<'propertyId' | 'details'>('propertyId');
  const [propertyId, setPropertyId] = useState('');
  const [taluka, setTaluka] = useState('');
  const [villageName, setVillageName] = useState('');
  const [surveyNo, setSurveyNo] = useState('');
  const [subDiv, setSubDiv] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (deleteMethod === 'propertyId') {
        response = await fetch('/api/delete/byproperty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ propertyID: propertyId }),
        });
      } else {
        response = await fetch('/api/delete/bylocation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taluka, villageName, surveyNo, subDiv }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      const result = await response.json();
      console.log(result.message);
      // TODO: Add user feedback (e.g., success message)
    } catch (error) {
      console.error('Error deleting property:', error);
      // TODO: Add user feedback (e.g., error message)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 bg-black text-white p-4">
        <h1 className="text-4xl font-bebas">LANDMASTER</h1>
        <Breadcrumb>
          <BreadcrumbList className="font-inter">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-white hover:text-gray-400">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Delete Data</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Delete Land Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup defaultValue="propertyId" onValueChange={(value) => setDeleteMethod(value as 'propertyId' | 'details')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="propertyId" id="propertyId" />
                <Label htmlFor="propertyId">Delete by Property ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="details" id="details" />
                <Label htmlFor="details">Delete by Details</Label>
              </div>
            </RadioGroup>

            {deleteMethod === 'propertyId' ? (
              <div className="space-y-2">
                <Label htmlFor="propertyId">Property ID</Label>
                <Input
                  id="propertyId"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  placeholder="Enter Property ID"
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taluka">Taluka</Label>
                  <Input
                    id="taluka"
                    value={taluka}
                    onChange={(e) => setTaluka(e.target.value)}
                    placeholder="Enter Taluka"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="villageName">Village Name</Label>
                  <Input
                    id="villageName"
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                    placeholder="Enter Village Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surveyNo">Survey No</Label>
                  <Input
                    id="surveyNo"
                    value={surveyNo}
                    onChange={(e) => setSurveyNo(e.target.value)}
                    placeholder="Enter Survey No"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subDiv">Sub Division</Label>
                  <Input
                    id="subDiv"
                    value={subDiv}
                    onChange={(e) => setSubDiv(e.target.value)}
                    placeholder="Enter Sub Division"
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">Delete Record</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
