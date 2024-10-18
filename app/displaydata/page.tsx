"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PropertyData {
  [key: string]: string | number | null;
}

export default function DisplayData() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<PropertyData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');

    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setPropertyData(parsedData);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (e) {
        console.error('Failed to parse data:', e);
        setError('Failed to parse data');
      }
    } else {
      setError('No data provided');
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Oops! Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => router.push('/')}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (propertyData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-8">
      <div className="container mx-auto bg-white rounded-lg shadow-xl p-6">
        <nav className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Property Record Display</h1>
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

        {propertyData.map((data, index) => (
          <Card key={index} className="mb-6 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-2xl text-blue-800">Property Details {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {Object.entries(data).map(([key, value]) => (
                    <TableRow key={key} className="hover:bg-gray-100">
                      <TableCell className="font-medium text-gray-700">{key}</TableCell>
                      <TableCell className="text-gray-900">{value !== null ? String(value) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
