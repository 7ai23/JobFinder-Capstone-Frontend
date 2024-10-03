import React, { useState, useEffect } from "react";
import axios from "../../../fetchData/axios";
import Hero from "@/components/User/Company/Hero";
import PaginationComponent from "@/components/User/Company/PaginationComponent";
import CompanyCard from "@/components/User/Company/CompanyCard";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams to manage URL state

const URL = "/getAllCompanies";

function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [types, setTypes] = useState([]);
  const [filter, setFilter] = useState({
    company: "",
    typeCompany: "Categories",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams(); // Hook for URL params
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  ); // Get current page from URL
  const companiesPerPage = 6;
  const totalCompanies = filteredCompanies.length;
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );
  const totalPages = Math.ceil(totalCompanies / companiesPerPage);

  const fetchCompanies = async (searchKey = "", typeCompany = "Categories") => {
    try {
      setLoading(true);
      const response = await axios.get(URL, {
        params: {
          limit: 1000,
          offset: 0,
          searchKey,
        },
      });
      if (response.data.errCode === 0) {
        setCompanies(response.data.data);
        setFilteredCompanies(filterCompanies(response.data.data, typeCompany));

        const uniqueTypes = [
          ...new Set(
            response.data.data.map((company) =>
              company.typeCompany.toUpperCase()
            )
          ),
        ];
        setTypes(uniqueTypes.map((type) => ({ name: type })));
      } else {
        setError(response.data.errMessage);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = (companies, typeCompany) => {
    const upperCaseType = typeCompany.toUpperCase();
    return companies.filter(
      (company) =>
        upperCaseType === "CATEGORIES" ||
        company.typeCompany.toUpperCase() === upperCaseType
    );
  };

  useEffect(() => {
    fetchCompanies(filter.company, filter.typeCompany);
  }, [filter.company, filter.typeCompany]);

  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage, setSearchParams]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-8">
      {" "}
      {/* Adjusted padding for smaller screens */}
      <div className="flex items-center justify-center bg-opacity-80 mx-2 sm:mx-4 my-4 sm:my-6 rounded-2xl">
        <div className="flex flex-col w-full max-w-7xl">
          <Hero
            filter={filter}
            handleSearch={(searchTerm) => {
              setFilter({ ...filter, company: searchTerm });
              setCurrentPage(1);
            }}
            setFilteredCompanies={setFilteredCompanies}
          />
          <div className="relative w-full flex justify-end pr-2 sm:pr-4 mt-2 sm:mt-4">
            <select
              id="typeFilter"
              className="p-1 sm:p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
              value={filter.typeCompany}
              onChange={(e) => {
                setFilter({ ...filter, typeCompany: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="Categories">Categories</option>
              {types.map((type, index) => (
                <option key={index} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 sm:px-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredCompanies.length === 0 ? (
          <p className="text-center text-gray-600">
            No companies match your search criteria.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentCompanies.map((company) => (
                <div
                  key={company.id}
                  className="w-full bg-white p-4 rounded-lg shadow-md flex items-center justify-center border border-transparent hover:border-primary transition-all"
                >
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Pagination Component */}
      <div className="flex justify-center mt-6">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default CompanyPage;
