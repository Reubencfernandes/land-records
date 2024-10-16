"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Tenant {
  tenancyid: string;
  tenantName: string;
  tenantKhataNo: string;
  tenantRemarks: string;
  tenantMutation: string;
}

interface Owner {
  ownerid: string;
  mutation: string;
  ownerName: string;
  khataNo: string;
  remarks: string;
  tenants: Tenant[];
}

export default function InsertData() {
  const [propertyid, setPropertyid] = useState('');
  const [croppedareaid, setCroppedareaid] = useState('');
  // Property table states
  const [villageName, setVillageName] = useState('');
  const [surveyNo, setSurveyNo] = useState('');
  const [taluka, setTaluka] = useState('');
  const [subdivision, setSubdivision] = useState('');
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
      ownerid: '',
      mutation: '',
      ownerName: '',
      khataNo: '',
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

  const addOwner = () => {
    setOwners([...owners, {
      ownerid: '',
      mutation: '',
      ownerName: '',
      khataNo: '',
      remarks: '',
      tenants: []
    }]);
  };

  const addTenant = (ownerIndex: number) => {
    const newOwners = [...owners];
    newOwners[ownerIndex].tenants.push({
      tenancyid: '',
      tenantName: '',
      tenantKhataNo: '',
      tenantRemarks: '',
      tenantMutation: ''
    });
    setOwners(newOwners);
  };

  const handleOwnerChange = (index: number, field: keyof Owner, value: string) => {
    const newOwners = [...owners];
    if (field !== 'tenants') {
      newOwners[index][field] = value;
    }
    setOwners(newOwners);
  };

  const handleTenantChange = (ownerIndex: number, tenantIndex: number, field: keyof Tenant, value: string) => {
    const newOwners = [...owners];
    newOwners[ownerIndex].tenants[tenantIndex][field] = value;
    setOwners(newOwners);
  };

  return (
    <div className="container mx-auto p-4">
      <form className="space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Property Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyid">Property ID</Label>
              <Input id="propertyid" value={propertyid} onChange={(e) => setPropertyid(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="villageName">Village Name</Label>
              <Input id="villageName" value={villageName} onChange={(e) => setVillageName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surveyNo">Survey No</Label>
              <Input id="surveyNo" value={surveyNo} onChange={(e) => setSurveyNo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taluka">Taluka</Label>
              <Input id="taluka" value={taluka} onChange={(e) => setTaluka(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdivision">Subdivision</Label>
              <Input id="subdivision" value={subdivision} onChange={(e) => setSubdivision(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ker">KER</Label>
              <Input id="ker" type="number" value={ker} onChange={(e) => setKer(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rice">Rice</Label>
              <Input id="rice" type="number" value={rice} onChange={(e) => setRice(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dryCrop">Dry Crop</Label>
              <Input id="dryCrop" type="number" value={dryCrop} onChange={(e) => setDryCrop(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="khazan">Khazan</Label>
              <Input id="khazan" type="number" value={khazan} onChange={(e) => setKhazan(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="morad">Morad</Label>
              <Input id="morad" type="number" value={morad} onChange={(e) => setMorad(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garden">Garden</Label>
              <Input id="garden" type="number" value={garden} onChange={(e) => setGarden(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="potKharab">Pot Kharab</Label>
              <Input id="potKharab" type="number" value={potKharab} onChange={(e) => setPotKharab(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classA">Class A</Label>
              <Input id="classA" type="number" value={classA} onChange={(e) => setClassA(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classB">Class B</Label>
              <Input id="classB" type="number" value={classB} onChange={(e) => setClassB(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {owners.map((owner, ownerIndex) => (
          <Card key={ownerIndex}>
            <CardHeader>
              <CardTitle>Owner {ownerIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`ownerid-${ownerIndex}`}>Owner ID</Label>
                  <Input id={`ownerid-${ownerIndex}`} value={owner.ownerid} onChange={(e) => handleOwnerChange(ownerIndex, 'ownerid', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`mutation-${ownerIndex}`}>Mutation</Label>
                  <Input id={`mutation-${ownerIndex}`} value={owner.mutation} onChange={(e) => handleOwnerChange(ownerIndex, 'mutation', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ownerName-${ownerIndex}`}>Owner Name</Label>
                  <Input id={`ownerName-${ownerIndex}`} value={owner.ownerName} onChange={(e) => handleOwnerChange(ownerIndex, 'ownerName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`khataNo-${ownerIndex}`}>Khata No</Label>
                  <Input id={`khataNo-${ownerIndex}`} value={owner.khataNo} onChange={(e) => handleOwnerChange(ownerIndex, 'khataNo', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`remarks-${ownerIndex}`}>Remarks</Label>
                  <Input id={`remarks-${ownerIndex}`} value={owner.remarks} onChange={(e) => handleOwnerChange(ownerIndex, 'remarks', e.target.value)} />
                </div>
              </div>
              
              {owner.tenants.map((tenant, tenantIndex) => (
                <Card key={tenantIndex}>
                  <CardHeader>
                    <CardTitle>Tenant {tenantIndex + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`tenancyid-${ownerIndex}-${tenantIndex}`}>Tenancy ID</Label>
                      <Input id={`tenancyid-${ownerIndex}-${tenantIndex}`} value={tenant.tenancyid} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenancyid', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenantName-${ownerIndex}-${tenantIndex}`}>Tenant Name</Label>
                      <Input id={`tenantName-${ownerIndex}-${tenantIndex}`} value={tenant.tenantName} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenantName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenantKhataNo-${ownerIndex}-${tenantIndex}`}>Tenant Khata No</Label>
                      <Input id={`tenantKhataNo-${ownerIndex}-${tenantIndex}`} value={tenant.tenantKhataNo} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenantKhataNo', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenantRemarks-${ownerIndex}-${tenantIndex}`}>Tenant Remarks</Label>
                      <Input id={`tenantRemarks-${ownerIndex}-${tenantIndex}`} value={tenant.tenantRemarks} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenantRemarks', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tenantMutation-${ownerIndex}-${tenantIndex}`}>Tenant Mutation</Label>
                      <Input id={`tenantMutation-${ownerIndex}-${tenantIndex}`} value={tenant.tenantMutation} onChange={(e) => handleTenantChange(ownerIndex, tenantIndex, 'tenantMutation', e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" onClick={() => addTenant(ownerIndex)}>Add Tenant</Button>
            </CardContent>
          </Card>
        ))}
        <Button type="button" onClick={addOwner}>Add Owner</Button>

        <Card>
          <CardHeader>
            <CardTitle>Cropped Area Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="croppedareaid">Cropped Area ID</Label>
              <Input id="croppedareaid" value={croppedareaid} onChange={(e) => setCroppedareaid(e.target.value)} />
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
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
