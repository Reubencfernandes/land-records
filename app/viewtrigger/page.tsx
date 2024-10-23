"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface LogEntry {
  id: number;
  message: string;
  time: string;
}

export default function ViewTrigger() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/');
      return;
    }

    const fetchLogEntries = async () => {
      try {
        const response = await fetch('/api/showtrigger');
        if (!response.ok) {
          throw new Error('Failed to fetch log entries');
        }
        const data = await response.json();
        setLogEntries(data);
      } catch (err) {
        setError('Error fetching log entries. Please try again later.');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogEntries();
  }, [router]);

  if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') !== 'true') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 bg-black text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bebas">LANDMASTER</h1>
          <Breadcrumb>
            <BreadcrumbList className="font-inter">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-gray-400 text-white">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-white'>View Triggers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bold mb-6">Trigger Log Entries</h1>
        
        {isLoading && (
          <div className="text-center mt-8">Loading...</div>
        )}

        {error && (
          <div className="text-center mt-8 text-red-500">{error}</div>
        )}

        {!isLoading && !error && (
          <Table>
            <TableCaption>A list of recent trigger log entries.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[200px]">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.id}</TableCell>
                  <TableCell>{entry.message}</TableCell>
                  <TableCell>{new Date(entry.time).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  );
}
