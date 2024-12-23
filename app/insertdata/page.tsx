"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Tenant {
  tenancyid: string;
  tenantName: string;
  tenantKhataNo: number;
  tenantRemarks: string;
  tenantMutation: number;
}

interface Owner {
  propertyid: string;
  ownerid: string;
  mutation: number;
  ownerName: string;
  khataNo: number;
  remarks: string;
  tenants: Tenant[];
}

export default function InsertData() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus !== 'true') {
      router.push('/'); // Redirect to home if not admin
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  const [propertyid, setPropertyid] = useState('');
  const [croppedareaid, setCroppedareaid] = useState('');
  // Property table states
  const [villageName, setVillageName] = useState('');
  const [surveyNo, setSurveyNo] = useState(0);
  const [taluka, setTaluka] = useState('');
  const [subdivision, setSubdivision] = useState(0);
  const [ker, setKer] = useState(0);
  const [rice, setRice] = useState(0);
  const [dryCrop, setDryCrop] = useState(0);
  const [khazan, setKhazan] = useState(0);
  const [morad, setMorad] = useState(0);
  const [garden, setGarden] = useState(0);
  const [potKharab, setPotKharab] = useState(0);
  const [classA, setClassA] = useState(0);
  const [classB, setClassB] = useState(0);

  // Owners and Tenants state
  const [owners, setOwners] = useState<Owner[]>([
    {
      propertyid: '',
      ownerid: '',
      mutation: 0,
      ownerName: '',
      khataNo: 0,
      remarks: '',
      tenants: []
    }
  ]);

  // CroppedArea table states
  const [irrigatedArea, setIrrigatedArea] = useState(0);
  const [year, setYear] = useState(0);
  const [season, setSeason] = useState('');
  const [cultivatorName, setCultivatorName] = useState('');
  const [cropName, setCropName] = useState('');
  const [landNotAvailable, setLandNotAvailable] = useState(false);
  const [sourceOfIrrigation, setSourceOfIrrigation] = useState('');
  const [cropRemarks, setCropRemarks] = useState('');
  const [unirrigatedArea, setUnirrigatedArea] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      const newPropertyId = uuidv4();
      setPropertyid(newPropertyId);
      setCroppedareaid(nanoid(10));
      setOwners(prevOwners => prevOwners.map(owner => ({...owner, ownerid: nanoid(), propertyid: newPropertyId})));
    }
  }, [isAdmin]);

  const addOwner = () => {
    setOwners([...owners, {
      propertyid: propertyid,
      ownerid: nanoid(),
      mutation:  0,
      ownerName: '',
      khataNo: 0,
      remarks: '',
      tenants: []
    }]);
  };

  const addTenant = (ownerIndex: number) => {
    const newOwners = [...owners];
    newOwners[ownerIndex].tenants.push({
      tenancyid: nanoid(),
      tenantName: '',
      tenantKhataNo: 0,
      tenantRemarks: '',
      tenantMutation: 0
    });
    setOwners(newOwners);
  };

  const handleOwnerChange = (index: number, field: keyof Owner, value: string) => {
    const newOwners = [...owners];
    if (field !== 'tenants') {
      if (field === 'mutation' || field === 'khataNo') {
        newOwners[index][field] = Number(value);
      } else {
        newOwners[index][field] = value;
      }
    }
    setOwners(newOwners);
  };

  const handleTenantChange = (ownerIndex: number, tenantIndex: number, field: keyof Tenant, value: string) => {
    const newOwners = [...owners];
    if (field === 'tenantName' || field === 'tenantRemarks') {
      newOwners[ownerIndex].tenants[tenantIndex][field] = value;
    } else if (field === 'tenantKhataNo' || field === 'tenantMutation') {
      newOwners[ownerIndex].tenants[tenantIndex][field] = Number(value);
    }
    setOwners(newOwners);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const propertyData = {
      propertyid,
      villageName,
      surveyNo,
      taluka,
      subdivision,
      ker,
      rice,
      dryCrop,
      khazan,
      morad,
      garden,
      potKharab,
      classA,
      classB
    }
    try {
      const response = await fetch('/api/insert/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit property data');
      }
    } catch (error) {
      console.error('Error submitting property data:', error);
      return;
    }
    const croppedAreaData = {
      croppedareaid,
      propertyid,
      irrigatedArea,
      year,
      season,
      cultivatorName,
      cropName,
      landNotAvailable,
      sourceOfIrrigation,
      cropRemarks,
      unirrigatedArea
    }
    try {
      const response = await fetch('/api/insert/cropped_area', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(croppedAreaData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit cropped area data');
      }
    } catch (error) {
      console.error('Error submitting cropped area data:', error);
      return;
    }
    // Send owners data
    for (const owner of owners) {
      try {
        const response = await fetch('/api/insert/owners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(owner),
        });

        if (!response.ok) {
          throw new Error('Failed to submit owner data');
        }
      } catch (error) {
        console.error('Error submitting owner data:', error);
        return;
      }

      // Send tenants data for each owner
      for (const tenant of owner.tenants) {
        try {
          const response = await fetch('/api/insert/tenant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...tenant, ownerid: owner.ownerid }),
          });

          if (!response.ok) {
            throw new Error('Failed to submit tenant data');
          }
        } catch (error) {
          console.error('Error submitting tenant data:', error);
          return;
        }
      }
    }

    // If all data was submitted successfully
    router.push('/');
  };

  if (!isAdmin) {
    return null; // Or you can return a loading component
  }

  return (
    <div className="container mx-auto p-4 font-inter">
      <nav className="flex items-center justify-between mb-6 bg-black text-white p-4">
        <h1 className="text-4xl font-bebas">LANDMASTER</h1>
        <Breadcrumb className="text-white">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-white hover:text-gray-400">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Insert Data</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Property Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyid">Property ID</Label>
              <Input id="propertyid" value={propertyid} readOnly className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="villageName">Area Name</Label>
              <Input id="villageName" value={villageName} onChange={(e) => setVillageName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surveyNo">Survey No</Label>
              <Input id="surveyNo" type="number" value={surveyNo} min={0} max={1000000000} onChange={(e) => setSurveyNo(Number(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taluka">Taluka</Label>
              <Input id="taluka" value={taluka} onChange={(e) => setTaluka(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdivision">Subdivision</Label>
              <Input id="subdivision" type="number" value={subdivision} min={0} max={1000000000} onChange={(e) => setSubdivision(Number(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ker">KER</Label>
              <Input id="ker" type="number" value={ker} min={0} max={1000000000} onChange={(e) => setKer(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rice">Rice</Label>
              <Input id="rice" type="number" value={rice} min={0} max={1000000000} onChange={(e) => setRice(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dryCrop">Dry Crop</Label>
              <Input id="dryCrop" type="number" value={dryCrop} min={0} max={1000000000} onChange={(e) => setDryCrop(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="khazan">Khazan</Label>
              <Input id="khazan" type="number" value={khazan} min={0} max={1000000000} onChange={(e) => setKhazan(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="morad">Morad</Label>
              <Input id="morad" type="number" value={morad} min={0} max={1000000000} onChange={(e) => setMorad(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garden">Garden</Label>
              <Input id="garden" type="number" value={garden} min={0} max={1000000000} onChange={(e) => setGarden(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="potKharab">Pot Kharab</Label>
              <Input id="potKharab" type="number" value={potKharab} min={0} max={1000000000} onChange={(e) => setPotKharab(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classA">Class A</Label>
              <Input id="classA" type="number" value={classA} min={0} max={1000000000} onChange={(e) => setClassA(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classB">Class B</Label>
              <Input id="classB" type="number" value={classB} min={0} max={1000000000} onChange={(e) => setClassB(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {owners.map((owner, ownerIndex) => (
          <Card key={ownerIndex} className="mb-6">
            <CardHeader>
              <CardTitle>Owner {ownerIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`propertyid-${ownerIndex}`}>Property ID</Label>
                  <Input id={`propertyid-${ownerIndex}`} value={propertyid} readOnly className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ownerid-${ownerIndex}`}>Owner ID</Label>
                  <Input id={`ownerid-${ownerIndex}`} value={owner.ownerid} readOnly className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ownerName-${ownerIndex}`}>Owner Name</Label>
                  <Input id={`ownerName-${ownerIndex}`} value={owner.ownerName} onChange={(e) => handleOwnerChange(ownerIndex, 'ownerName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`mutation-${ownerIndex}`}>Mutation</Label>
                  <Input id={`mutation-${ownerIndex}`} type="number" value={owner.mutation} min={0} max={1000000000} onChange={(e) => handleOwnerChange(ownerIndex, 'mutation', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`khataNo-${ownerIndex}`}>Khata No</Label>
                  <Input id={`khataNo-${ownerIndex}`} type="number" value={owner.khataNo} min={0} max={1000000000} onChange={(e) => handleOwnerChange(ownerIndex, 'khataNo', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`remarks-${ownerIndex}`}>Remarks</Label>
                  <Input id={`remarks-${ownerIndex}`} value={owner.remarks} onChange={(e) => handleOwnerChange(ownerIndex, 'remarks', e.target.value)} />
                </div>
              </div>
              
              {owner.tenants.map((tenant, tenantIndex) => (
                <Card key={tenantIndex} className="mt-4">
                  <CardHeader>
                    <CardTitle>Tenant {tenantIndex + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`ownerid-${ownerIndex}-${tenantIndex}`}>Owner ID</Label>
                      <Input id={`ownerid-${ownerIndex}-${tenantIndex}`} value={owner.ownerid} readOnly className="bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenancyid-${ownerIndex}-${tenantIndex}`}>Tenancy ID</Label>
                      <Input id={`tenancyid-${ownerIndex}-${tenantIndex}`} value={tenant.tenancyid} readOnly className="bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenantName-${ownerIndex}-${tenantIndex}`}>Tenant Name</Label>
                      <Input id={`tenantName-${ownerIndex}-${tenantIndex}`} value={tenant.tenantName} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenantName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenantKhataNo-${ownerIndex}-${tenantIndex}`}>Tenant Khata No</Label>
                      <Input id={`tenantKhataNo-${ownerIndex}-${tenantIndex}`} type="number" min={0} max={1000000000} value={tenant.tenantKhataNo} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenantKhataNo', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenantRemarks-${ownerIndex}-${tenantIndex}`}>Tenant Remarks</Label>
                      <Input id={`tenantRemarks-${ownerIndex}-${tenantIndex}`} value={tenant.tenantRemarks} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenantRemarks', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenantMutation-${ownerIndex}-${tenantIndex}`}>Tenant Mutation</Label>
                      <Input id={`tenantMutation-${ownerIndex}-${tenantIndex}`} value={tenant.tenantMutation} type="number" min={0} max={1000000000} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenantMutation', e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" onClick={() => addTenant(ownerIndex)} className="mt-4">Add Tenant</Button>
            </CardContent>
          </Card>
        ))}
        <Button type="button" onClick={addOwner} className="mb-6">Add Owner</Button>

        <Card>
          <CardHeader>
            <CardTitle>Cropped Area Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyid">Property ID</Label>
              <Input id="propertyid" value={propertyid} readOnly className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="croppedareaid">Cropped Area ID</Label>
              <Input id="croppedareaid" value={croppedareaid} readOnly className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="irrigatedArea">Irrigated Area</Label>
              <Input id="irrigatedArea" type="number" value={irrigatedArea} onChange={(e) => setIrrigatedArea(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Input id="season" value={season} onChange={(e) => setSeason(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cultivatorName">Cultivator Name</Label>
              <Input id="cultivatorName" value={cultivatorName} onChange={(e) => setCultivatorName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropName">Crop Name</Label>
              <Input id="cropName" value={cropName} onChange={(e) => setCropName(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="landNotAvailable" checked={landNotAvailable} onCheckedChange={(checked) => setLandNotAvailable(checked as boolean)} />
              <Label htmlFor="landNotAvailable">Land Not Available</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceOfIrrigation">Source Of Irrigation</Label>
              <Input id="sourceOfIrrigation" value={sourceOfIrrigation} onChange={(e) => setSourceOfIrrigation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropRemarks">Crop Remarks</Label>
              <Input id="cropRemarks" value={cropRemarks} onChange={(e) => setCropRemarks(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unirrigatedArea">Unirrigated Area</Label>
              <Input id="unirrigatedArea" type="number" value={unirrigatedArea} onChange={(e) => setUnirrigatedArea(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
}
