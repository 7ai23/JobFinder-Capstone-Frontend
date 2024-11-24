import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@/components/ui/button";
import { getAllReport, handleCheckReport } from "../../../fetchData/Report";
import { getAllPost } from "../../../fetchData/Post";
import AdminPagination from "./AdminPagination";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const ManageReport = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // New state for filter

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // Dialog State
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsResponse, postsResponse] = await Promise.all([
        getAllReport(),
        getAllPost(),
      ]);

      if (
        Array.isArray(reportsResponse.data.data) &&
        Array.isArray(postsResponse.data.data)
      ) {
        const filteredReports = reportsResponse.data.data.filter(
          (report) => report.isChecked === 0 // Filter by isChecked = 1
        );
        setReports(filteredReports);
        setPosts(postsResponse.data.data);
        setTotalCount(filteredReports.length);
        setFilteredReports(filteredReports); // Set filtered reports initially
      } else {
        setError("Error fetching data. Please try again later.");
        console.log(
          "Error fetching data. Please try again later.",
          reportsResponse
        );
      }
    } catch (error) {
      setError("loi roi");
      console.log("Error fetching data. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch reports and posts
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter job types based on the input
    const filtered = reports.filter((report) => {
      const postName = getPostNameById(report.postId);
      return postName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredReports(filtered);
  };

  const handleSearchClick = () => {
    const filtered = reports.filter((report) => {
      const postName = getPostNameById(report.postId);
      return postName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredReports(filtered);
  };

  const handleToggle = (report) => {
    if (report.isAdminChecked === 0) {
      setSelectedReport(report);
      setShowDialog(true);
    }
  };

  const handleConfirmToggle = async () => {
    if (selectedReport) {
      try {
        await handleCheckReport({ reportId: selectedReport.id });
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === selectedReport.id
              ? { ...report, isAdminChecked: 1 }
              : report
          )
        );
        fetchData();
        setShowDialog(false);
        toast.success("Check report successfully!");
      } catch (error) {
        console.error("Error checking report", error);
      }
    }
  };

  const handleCancelToggle = () => {
    setShowDialog(false);
  };

  // // Ban post if report count with isAdminChecked = 1 is 10
  // const postReportCounts = reports.reduce((acc, report) => {
  //   if (report.isAdminChecked === 1) {
  //     acc[report.postId] = (acc[report.postId] || 0) + 1;
  //   }
  //   return acc;
  // }, {});

  // const bannedPosts = Object.keys(postReportCounts).filter(
  //   (postId) => postReportCounts[postId] >= 10
  // );

  const getPostNameById = (postId) => {
    const post = posts.find((p) => p.id === postId);
    return post ? post.postDetailData.name : "Unknown Post";
  };

  // Filter reports based on filter status
  const filterReports = (status, reportsList = reports) => {
    if (status === "all") {
      setFilteredReports(reportsList);
    } else {
      const isAdminChecked = status === "checked" ? 1 : 0;
      setFilteredReports(
        reportsList.filter((report) => report.isAdminChecked === isAdminChecked)
      );
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setFilterStatus(selectedStatus);
    filterReports(selectedStatus);
  };

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="border border-blue-gray-100 shadow-sm rounded-lg">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2 w-1/2">
          <div className="relative flex-grow">
            <Input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              type="text"
              placeholder="Search by post name..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon sx={{ color: "gray" }} />
            </div>
          </div>
        </div>

        {/* Filter by status */}
        <div className="flex items-center gap-4">
          <Label htmlFor="type-select">Filter by Type:</Label>
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All</option>
            <option value="unchecked">Unchecked</option>
            <option value="checked">Checked</option>
          </select>
        </div>
      </div>

      <Table className="table-auto w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">STT</TableHead>
            <TableHead className="text-center">Name Post</TableHead>
            <TableHead className="text-center">Reason</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentReports.map((report, index) => (
            <TableRow
              key={report.id}
              className="cursor-pointer hover:bg-slate-300"
            >
              <TableCell className="text-center">
                {index + 1 + (currentPage - 1) * reportsPerPage}
              </TableCell>
              <TableCell className="text-center">
                {getPostNameById(report.postId)}
              </TableCell>
              <TableCell className="text-center">{report.reason}</TableCell>
              <TableCell className="text-center">
                {report.description}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-white w-20 text-center inline-block text-xs ${
                    report.isAdminChecked === 1 ? "bg-blue-500" : "bg-red-500"
                  }`}
                >
                  {report.isAdminChecked === 1 ? "Checked" : "Unchecked"}
                </span>
              </TableCell>

              <TableCell className="text-center flex space-x-3 items-center justify-center">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() => handleToggle(report)}
                    disabled={report.isAdminChecked === 1}
                  />
                  <div
                    className={`w-11 h-6 rounded-full flex items-center justify-between p-1 ${
                      report.isAdminChecked === 1 ? "bg-primary" : "bg-gray-200"
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer dark:bg-gray-700 peer-checked:dark:bg-blue peer-checked:bg-blue peer-checked:ring-0`}
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${
                        report.isAdminChecked === 1
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </div>
                </label>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">
              Are you sure you want to approve this report?
            </h2>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleCancelToggle}
                className="bg-third hover:text-white text-white rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmToggle}
                className="bg-third hover:text-white text-white rounded-md"
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReport;
