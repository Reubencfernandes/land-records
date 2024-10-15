"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [selection, setSelection] = useState("name");

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  return (
    <div>
      <nav className="bg-black py-4">
        <div className="flex items-center mx-auto justify-between px-10">
          <h1 className="text-4xl font-bold text-white">PROPERTY RECORD</h1>
          <div className="pl-4 hover:text-red-500">
            <Link href="/insertdata" className="pr-4 pl-4 text-white">
              Add Record
            </Link>
            <Link href="/deletedata" className="text-white">
              Delete Records
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Property Records</h1>
          <p className="text-xl mb-6">
            Quickly find property information using our fast and efficient search tools.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <form
              id="searchForm"
              action="/api/showsearched"
              method="post"
              className="flex flex-col sm:flex-row items-center w-full"
            >
              <select
                id="searchOption"
                value={selection}
                onChange={handleSelectionChange}
                className="text-black py-3 px-4 rounded-md mb-4 sm:mb-0 sm:mr-2"
              >
                <option value="name">Name</option>
                <option value="location">Location</option>
              </select>

              {selection === "name" ? (
                <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                  <input
                    type="text"
                    name="owner_name"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md"
                    placeholder="Enter the property owner's name"
                    required
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-4 mb-4 sm:mb-0">
                  <input
                    type="text"
                    name="taluka"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md"
                    placeholder="Taluka"
                    required
                  />
                  <input
                    type="text"
                    name="village_name"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md"
                    placeholder="Village Name"
                    required
                  />
                  <input
                    type="text"
                    name="survey_no"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md"
                    placeholder="Survey No"
                    required
                  />
                  <input
                    type="text"
                    name="sub_div"
                    className="bg-white text-black border-none py-3 px-4 w-full rounded-md"
                    placeholder="Sub Div"
                    required
                  />
                </div>
              )}

              <button
                id="searchButton"
                type="submit"
                name="search_by_name"
                className="bg-green-500 text-white py-3 px-8 rounded-md"
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
