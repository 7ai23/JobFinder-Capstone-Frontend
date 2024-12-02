import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getAllCompanies,
  getCompanyById,
  banCompany,
  inactiveCompany,
  activeCompany,
  unbanCompany,
} from "@/fetchData/Company";
import AdminPagination from "./AdminPagination";
import toast from "react-hot-toast";
import GlobalLoadingMain from "@/components/GlobalLoading/GlobalLoadingMain";
import GlobalLoading from "@/components/GlobalLoading/GlobalLoading";

const ManageCompanyAdmin = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentCompanyDetail, setcurrentCompanyDetail] = useState(null);
  const [currentCompanyId, setcurrentCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const companiesPerPage = 10;
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );
  const [action, setAction] = useState("");
  const [note, setNote] = useState("");

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getAllCompanies(searchTerm);
      setTimeout(() => {
        if (response.data.errCode === 0) {
          const sortedData = response.data.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          setCompanies(sortedData);
          setFilteredCompanies(sortedData);
        } else {
          setError("Error fetching data. Please try again later.");
          setCompanies([]);
        }
        setLoading(false); // Dừng loading sau 3 giây
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setError("Error fetching data. Please try again later.");
        setCompanies([]);
        setLoading(false);
      }, 1000); // Thời gian chờ là 3 giây
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search]);
  const fetchCompanyDetails = async () => {
    if (currentCompanyId !== null) {
      try {
        setLoading(true);
        const response = await getCompanyById(currentCompanyId);
        setcurrentCompanyDetail(response.data.data);
      } catch (error) {
        setError("Error fetching post details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchCompanyDetails();
  }, [currentCompanyId]);

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    let filtered;
    if (status === "ALL") {
      filtered = companies;
    } else {
      filtered = companies.filter(
        (company) => company.statusCode.toUpperCase() === status.toUpperCase()
      );
    }
    setFilteredCompanies(filtered);
  };

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);

  const handleOpenUpdateModal = (id) => {
    setcurrentCompanyId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSearch = () => {
    setSearch(searchTerm);
    fetchCompanies(search);
  };
  const handleInactive = async () => {
    try {
      setIsSubmiting(true);
      const res = await inactiveCompany(currentCompanyDetail.id);
      console.log("res.data: ", res.data.errCode);
      if (res.data.errCode === 0) {
        toast.success("Công ty đã bị từ chối!");
        fetchCompanies();
        fetchCompanyDetails();
        setShowConfirm(false);
        setModalOpen(false);
      } else {
        toast.error("Có lỗi xảy ra:", res.data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi gọi API:", error);
    } finally {
      setIsSubmiting(false);
    }
  };
  const handleActive = async () => {
    try {
      setIsSubmiting(true);
      const res = await activeCompany(currentCompanyDetail.id);
      console.log("res.data: ", res.data.errCode);
      if (res.data.errCode === 0) {
        toast.success("Công ty đã approve thành công!");
        fetchCompanies();
        fetchCompanyDetails();
        setShowConfirm(false);
        setModalOpen(false);
      } else {
        toast.error("Có lỗi xảy ra:", res.data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi gọi API:", error);
    } finally {
      setIsSubmiting(false);
    }
  };
  const handleUnban = async () => {
    try {
      setIsSubmiting(true);
      const res = await unbanCompany(currentCompanyDetail.id);
      console.log("res.data: ", res.data.errCode);
      if (res.data.errCode === 0) {
        toast.success("Công ty đã được mở khóa!");
        fetchCompanies();
        fetchCompanyDetails();
        setShowConfirm(false);
        setModalOpen(false);
      } else {
        toast.error("Có lỗi xảy ra:", res.data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi gọi API:", error);
    } finally {
      setIsSubmiting(false);
    }
  };
  const handleBan = async () => {
    try {
      setIsSubmiting(true);
      const res = await banCompany(currentCompanyDetail.id, note);
      console.log("res.data: ", res.data.errCode);
      if (res.data.errCode === 0) {
        fetchCompanies();
        fetchCompanyDetails();
        toast.success("Công ty đã bị cấm thành công!");
        setShowConfirm(false);
        setModalOpen(false);
      } else {
        toast.error("Có lỗi xảy ra:", res.data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi gọi API:", error);
    } finally {
      setIsSubmiting(false);
    }
  };

  if (loading) return <GlobalLoadingMain isSubmiting={true} />;

  if (error) return <p>{error}</p>;

  return (
    <div className="border border-blue-gray-100 shadow-sm rounded-lg">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-grow">
            <Input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              type="text"
              placeholder="Search by company name..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon sx={{ color: "gray" }} />
            </div>
          </div>
          <Button
            onClick={handleSearch}
            className="p-3 text-white bg-third hover:bg-primary rounded-md"
          >
            Search
          </Button>
        </div>
        <div className="relative w-full flex justify-end pr-2 sm:pr-4 mt-2 sm:mt-4">
          <select
            id="typeFilter"
            className="p-1 sm:p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            {" "}
            <option value="ALL">All Status</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="BANNED">BANNED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>
      <Table className="table-auto w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">STT</TableHead>
            <TableHead className="text-center">Company Name</TableHead>
            <TableHead className="text-center">Phone Number</TableHead>
            <TableHead className="text-center">Type Company</TableHead>
            <TableHead className="text-center">Tax number</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCompanies.map((company, index) => (
            <TableRow
              key={company.id}
              onClick={() => handleOpenUpdateModal(company.id)}
              className="cursor-pointer hover:bg-slate-300"
            >
              <TableCell className="text-center">
                {index + 1 + indexOfFirstCompany}
              </TableCell>
              <TableCell className="text-center">{company.name}</TableCell>
              <TableCell className="text-center">
                {company.phonenumber || "N/A"}
              </TableCell>
              <TableCell className="text-center">
                {company.typeCompany ? company.typeCompany.toUpperCase() : ""}
              </TableCell>
              <TableCell className="text-center">{company.taxnumber}</TableCell>
              <TableCell className="text-center">
                <span
                  className={`w-20 text-center inline-block py-1 px-2 rounded-full text-xs ${
                    company.statusCode.toUpperCase() === "APPROVED"
                      ? "bg-green-500 text-white"
                      : company.statusCode.toUpperCase() === "PENDING"
                      ? "bg-gray-500 text-white"
                      : company.statusCode.toUpperCase() === "BANNED"
                      ? "bg-orange-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {company.statusCode.toUpperCase() === "APPROVED"
                    ? "APPROVED"
                    : company.statusCode.toUpperCase() === "PENDING"
                    ? "PENDING"
                    : company.statusCode.toUpperCase() === "BANNED"
                    ? "BANNED"
                    : "REJECTED"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage} // Update currentPage when page changes
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Dialog for view detail company */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          {currentCompanyDetail && (
            <>
              <DialogHeader>
                <DialogTitle>{currentCompanyDetail.name}</DialogTitle>
              </DialogHeader>
              <div className="border-t border-gray-200 mt-4">
                <dl>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div
                        className="ml-8"
                        dangerouslySetInnerHTML={{
                          __html: currentCompanyDetail.description,
                        }}
                      />
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Website
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.website}
                    </dd>
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.address}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.phonenumber}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Amount Employer
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.amountEmployer}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Tax number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.taxnumber}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Type Company
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.typeCompany
                        ? String(currentCompanyDetail.typeCompany).toUpperCase()
                        : ""}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">File</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.file}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Allow Hot Post
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.allowHotPost === 1 ? "Yes" : "No"}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Allow Cv
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentCompanyDetail.allowCv === 1 ? "Yes" : "No"}
                    </dd>
                  </div>
                  <div className="pt-6">
                    <div className="flex justify-end">
                      {currentCompanyDetail.statusCode.toUpperCase() ===
                        "PENDING".toUpperCase() && (
                        <>
                          <button
                            onClick={handleActive}
                            className="p-3 text-white bg-green-500 hover:bg-green-700 rounded-md mr-2"
                          >
                            Approve
                          </button>
                          <GlobalLoadingMain isSubmiting={isSubmiting} />
                          <button
                            onClick={() => {
                              setShowConfirm(true);
                              setAction("reject");
                            }}
                            className="p-3 text-white bg-red-500 hover:bg-red-700 rounded-md"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {currentCompanyDetail.statusCode.toUpperCase() ===
                        "APPROVED".toUpperCase() && (
                        <>
                          <button
                            onClick={() => {
                              setShowConfirm(true);
                              setAction("reject");
                            }}
                            className="p-3 text-white bg-red-500 hover:bg-red-700 rounded-md mr-2"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              setShowConfirm(true);
                              setAction("ban");
                            }}
                            className="p-3 text-white bg-orange-500 hover:bg-orange-700 rounded-md"
                          >
                            Ban
                          </button>
                        </>
                      )}
                      {currentCompanyDetail.statusCode.toUpperCase() ===
                        "REJECTED".toUpperCase() && (
                        <button
                          onClick={handleActive}
                          className="p-3 text-white bg-green-500 hover:bg-green-700 rounded-md"
                        >
                          Approve
                        </button>
                      )}
                      <GlobalLoadingMain isSubmiting={isSubmiting} />
                      {currentCompanyDetail.statusCode.toUpperCase() ===
                        "BANNED".toUpperCase() && (
                        <button
                          onClick={() => {
                            setShowConfirm(true);
                            setAction("unban");
                          }}
                          className="p-3 text-white bg-blue-500 hover:bg-blue-700 rounded-md"
                        >
                          Unban
                        </button>
                      )}
                    </div>

                    {showConfirm === true && (
                      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Confirm Action</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Are you sure {action}?
                          </DialogDescription>
                          <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                            Warning: This action cannot be undone.
                          </h3>
                          {action === "ban" && (
                            <div className="mt-4">
                              <label
                                htmlFor="banReason"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Reason for {action}:
                              </label>
                              <Input
                                id="banReason"
                                type="text"
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Enter the reason for banning this user"
                              />
                            </div>
                          )}
                          <div className="flex justify-center mt-4">
                            <button
                              onClick={() => {
                                if (
                                  action.toUpperCase() === "ban".toUpperCase()
                                ) {
                                  handleBan(note);
                                }
                                if (
                                  action.toUpperCase() ===
                                  "reject".toUpperCase()
                                ) {
                                  handleInactive();
                                }
                                if (
                                  action.toUpperCase() === "unban".toUpperCase()
                                ) {
                                  handleUnban();
                                }
                                setNote("");
                              }}
                              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
                            >
                              Yes, I am sure
                            </button>
                            <GlobalLoadingMain isSubmiting={isSubmiting} />
                            <button
                              onClick={() => setShowConfirm(false)}
                              className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                            >
                              No, cancel
                            </button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </dl>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCompanyAdmin;
