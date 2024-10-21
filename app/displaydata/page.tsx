"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function PropertyDetails() {
  // This would typically come from a database or API
  const propertyData = {
    villageName: "Sample Village",
    surveyNo: "123",
    subDivisionNo: "A",
    taluka: "Sample Taluka",
    totalArea: 1000,
    cultivableArea: {
      ker: 200,
      rice: 300,
      dryCrop: 100,
      khzan: 50,
      morad: 50,
      garden: 100
    },
    uncultivableArea: {
      classA: 100,
      classB: 50,
      potKarab: 50
    },
    owners: [
      { name: "John Doe", mutation: "M123", khataNo: "K1", tenants: ["Alice", "Bob"] },
      { name: "Jane Smith", mutation: "M124", khataNo: "K2", tenants: ["Charlie"] }
    ],
    croppedArea: {
      irrigatedArea: 150,
      unirrigatedArea: 250,
      cropName: "Wheat",
      year: 2023,
      season: "Kharif",
      cultivatorName: "John Doe",
      landNotAvailableForCultivation: false,
      sourceOfIrrigation: "Canal",
      remarks: "Good yield expected"
    }
  }

  const totalCultivableArea = Object.values(propertyData.cultivableArea).reduce((a, b) => a + b, 0)
  const totalUncultivableArea = Object.values(propertyData.uncultivableArea).reduce((a, b) => a + b, 0)

  const items = [
    {
      title: "Location Information",
      description: (
        <>
          <p><strong>Village:</strong> {propertyData.villageName}</p>
          <p><strong>Survey No:</strong> {propertyData.surveyNo}</p>
          <p><strong>Sub Division No:</strong> {propertyData.subDivisionNo}</p>
          <p><strong>Taluka:</strong> {propertyData.taluka}</p>
        </>
      ),
    },
    {
      title: "Area Overview",
      description: (
        <>
          <p><strong>Total Area:</strong> {propertyData.totalArea} sq m</p>
          <p><strong>Cultivable:</strong> {totalCultivableArea} sq m</p>
          <p><strong>Uncultivable:</strong> {totalUncultivableArea} sq m</p>
        </>
      ),
    },
    {
      title: "Cultivable Area Breakdown",
      description: (
        <>
          {Object.entries(propertyData.cultivableArea).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value} sq m</p>
          ))}
        </>
      ),
    },
    {
      title: "Uncultivable Area Breakdown",
      description: (
        <>
          {Object.entries(propertyData.uncultivableArea).map(([key, value]) => (
            <p key={key}><strong>{key.replace('class', 'Class ')}:</strong> {value} sq m</p>
          ))}
        </>
      ),
    },
    {
      title: "Owners and Tenants",
      description: (
        <>
          {propertyData.owners.map((owner, index) => (
            <div key={index} className="mb-2">
              <p><strong>Owner:</strong> {owner.name}</p>
              <p><strong>Mutation:</strong> {owner.mutation}</p>
              <p><strong>Khata:</strong> {owner.khataNo}</p>
              <p><strong>Tenants:</strong> {owner.tenants.join(', ')}</p>
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Cropped Area Information",
      description: (
        <>
          <p><strong>Irrigated Area:</strong> {propertyData.croppedArea.irrigatedArea} sq m</p>
          <p><strong>Unirrigated Area:</strong> {propertyData.croppedArea.unirrigatedArea} sq m</p>
          <p><strong>Crop Name:</strong> {propertyData.croppedArea.cropName}</p>
          <p><strong>Year:</strong> {propertyData.croppedArea.year}</p>
          <p><strong>Season:</strong> {propertyData.croppedArea.season}</p>
          <p><strong>Cultivator Name:</strong> {propertyData.croppedArea.cultivatorName}</p>
          <p><strong>Land Not Available For Cultivation:</strong> {propertyData.croppedArea.landNotAvailableForCultivation ? 'Yes' : 'No'}</p>
          <p><strong>Source of Irrigation:</strong> {propertyData.croppedArea.sourceOfIrrigation}</p>
          <p><strong>Remarks:</strong> {propertyData.croppedArea.remarks}</p>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 font-inter text-lg">
      <nav className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">LANDMASTER</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <IconChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Property Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
      <h2 className="text-3xl font-bold mb-6">Property Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <CardContainer key={i} className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-2xl font-bold text-neutral-600 dark:text-white"
              >
                {item.title}
              </CardItem>
              <CardItem
                as="div"
                translateZ="60"
                className="text-neutral-500 text-base mt-4 dark:text-neutral-300"
              >
                {item.description}
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  )
}