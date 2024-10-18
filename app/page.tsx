"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DisplayData from "./displaydata/page";

export default function Home() {
  const [selection, setSelection] = useState("name");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const searchType = form.searchType.value;

    let response;
    if (searchType === "name") {
      const name = (form.oname as HTMLInputElement).value;
      response = await fetch('/api/search/byname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
    } else if (searchType === "location") {
      const taluka = (form.taluka as HTMLInputElement).value;
      const villageName = (form.village_name as HTMLInputElement).value;
      const surveyNo = (form.survey_no as HTMLInputElement).value;
      const subDivision = (form.sub_div as HTMLInputElement).value;
      response = await fetch('/api/search/bylocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taluka, village_name: villageName, survey_no: surveyNo, sub_division: subDivision }),
      });
    }

    if (response && response.ok) {
      const fetchedData = await response.json();
      setData(fetchedData);
      setError(null);
      router.push(`/displaydata?data=${encodeURIComponent(JSON.stringify(fetchedData))}`);
    } else {
      const errorData = await response?.json();
      const errorMessage = errorData?.error || 'Failed to fetch data';
      console.error(errorMessage);
      setError(errorMessage);
      router.push(`/displaydata?error=${encodeURIComponent(errorMessage)}`);
    }
  };

  return (
    <div className="bg-[url('https://cdn.midjourney.com/57d036ee-e34e-4b99-81c7-0b6e138c0dc4/0_0.png')] bg-cover bg-center min-h-screen">
      <nav className="bg-black bg-opacity-70 py-4">
        <div className="flex items-center mx-auto justify-between px-10">
          <h1 className="text-4xl font-bold text-white font-inter">PROPERTY RECORD</h1>
          <div className="pl-4 hover:text-red-500">
            <Link href="/viewtrigger" className="pr-4 pl-4 text-white font-inter">View Triggers</Link>
            <Link href="/insertdata" className="pr-4 pl-4 text-white font-inter">
              Add Record
            </Link>
            <Link href="/api/create" className="pr-4 pl-4 text-white font-inter">
              Create Database
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-white font-inter">Property Records</h1>
          <p className="text-xl mb-6 text-white font-inter">
            Quickly find property information using our fast and efficient search tools.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <form
              id="searchForm"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center w-full"
            >
              <select
                id="searchOption"
                name="searchType"
                value={selection}
                onChange={handleSelectionChange}
                className="text-black py-3 px-4 rounded-md mb-4 sm:mb-0 sm:mr-2 font-inter"
              >
                <option value="name">Name</option>
                <option value="location">Location</option>
              </select>

              {selection === "name" && (
                <div className="flex items-center sm:w-auto mb-4 sm:mb-0">
                  <input
                    type="text"
                    name="oname"
                    className="bg-white text-black border-none py-3 px-4 w-full sm:w-96 rounded-md font-inter"
                    placeholder="Enter the property owner's name"
                    required
                  />
                </div>
              )}

              {selection === "location" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4 sm:mb-0">
                  <input
                    type="text"
                    name="taluka"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md font-inter"
                    placeholder="Taluka"
                    required
                  />
                  <input
                    type="text"
                    name="village_name"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md font-inter"
                    placeholder="Village Name"
                    required
                  />
                  <input
                    type="text"
                    name="survey_no"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md font-inter"
                    placeholder="Survey No"
                    required
                  />
                  <input
                    type="text"
                    name="sub_div"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md font-inter"
                    placeholder="Sub Div"
                    required
                  />
                </div>
              )}

              <button
                id="searchButton"
                type="submit"
                className="bg-green-500 text-white py-3 px-8 rounded-md font-inter mt-4 sm:mt-0 sm:ml-2"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
