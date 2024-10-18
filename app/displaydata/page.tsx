"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

interface PropertyData {
  [key: string]: string | number;
}

interface CroppedAreaData {
  [key: string]: string | number | object;
}

export default function DisplayData() {
  const searchParams = useSearchParams();
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [croppedAreaData, setCroppedAreaData] = useState<CroppedAreaData | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const taluka = searchParams.get('taluka');
      const villageName = searchParams.get('village_name');
      const surveyNo = searchParams.get('survey_no');
      const subDivision = searchParams.get('sub_division');
      const name = searchParams.get('name');

      let response;
      console.log(name);
      if (name) {
        response = await fetch('/api/search/byname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });
      } else {
        response = await fetch('/api/search/bylocation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taluka, village_name: villageName, survey_no: surveyNo, sub_division: subDivision }),
        });
      }

      if (response.ok) {
        const data = await response.json();
        setPropertyData(data.property);
        setCroppedAreaData(data.croppedArea);
        setOwners(data.owners);
      } else {
        console.error('Failed to fetch data');
      }
    };

    fetchData();
  }, [searchParams]);

  if (!propertyData || !croppedAreaData || owners.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <nav className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Property Record Display</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Display Data</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {Object.entries(propertyData).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell>{String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cropped Area Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {Object.entries(croppedAreaData).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {owners.map((owner, index) => (
        <Card key={owner.ownerid} className="mb-6">
          <CardHeader>
            <CardTitle>Owner {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {Object.entries(owner).map(([key, value]) => (
                  key !== 'tenants' && (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{String(value)}</TableCell>
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>

            {owner.tenants.map((tenant, tenantIndex) => (
              <Card key={tenant.tenancyid} className="mt-4">
                <CardHeader>
                  <CardTitle>Tenant {tenantIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {Object.entries(tenant).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell>{String(value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
