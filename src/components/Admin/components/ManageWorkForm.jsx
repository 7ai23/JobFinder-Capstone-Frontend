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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { Input } from "@/components/ui/input";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@/components/ui/button";
import {
  getAllWorkType,
  handleCreateNewAllCode,
  handleUpdateAllCode,
  handleDeleteAllCode,
} from "../../../fetchData/AllCode";
import { Label } from "@/components/ui/label";
import AdminPagination from "./AdminPagination";

const ManageWorkForm = () => {
  const [workTypes, setWorkTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const [newWorkType, setNewWorkType] = useState({
    code: "",
    type: "WORKTYPE",
    value: "",
  });

  const [updateWorkType, setUpdateWorkType] = useState({
    code: "",
    type: "WORKTYPE",
    value: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Set the number of items per page
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchWorkTypes = async () => {
      try {
        setLoading(true);
        const response = await getAllWorkType();
        if (Array.isArray(response.data.data)) {
          setWorkTypes(response.data.data);
          setTotalCount(response.data.data.length); // Set total count of work types
        } else {
          setError("Error fetching data. Please try again later.");
          setWorkTypes([]);
        }
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        setWorkTypes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkTypes();
  }, []);

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    setNewWorkType({ code: "", type: "WORKTYPE", value: "" });
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setNewWorkType({ code: "", type: "WORKTYPE", value: "" });
  };

  const handleOpenUpdateModal = (workType) => {
    setUpdateWorkType(workType);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setUpdateWorkType({ code: "", type: "WORKTYPE", value: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isCreateModalOpen) {
      setNewWorkType((prev) => ({ ...prev, [name]: value }));
    } else {
      setUpdateWorkType((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      type: "WORKTYPE",
      value: newWorkType.value,
      code: newWorkType.code,
    };

    try {
      const response = await handleCreateNewAllCode(userData);
      console.log("Create Response:", response);

      if (response.data && response.data.errCode === 0) {
        setWorkTypes((prev) => [...prev, userData]);
        setTotalCount((prev) => prev + 1); // Update total count
      } else {
        console.error(
          "Failed to create job type:",
          response.data.message || "No message"
        );
      }

      handleCloseCreateModal();
    } catch (error) {
      console.error("Error saving job type:", error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      type: updateWorkType.type,
      value: updateWorkType.value,
      code: updateWorkType.code,
    };

    try {
      const response = await handleUpdateAllCode(userData);
      console.log("Update Response:", response);

      if (response.data && response.data.errCode === 0) {
        setWorkTypes((prev) =>
          prev.map((workType) =>
            workType.code === userData.code
              ? { ...workType, value: userData.value }
              : workType
          )
        );
      } else {
        console.error(
          "Failed to update job type:",
          response.data.message || "No message"
        );
      }

      handleCloseUpdateModal();
    } catch (error) {
      console.error("Error updating job type:", error);
    }
  };

  const handleDelete = async (code) => {
    try {
      const response = await handleDeleteAllCode({ code });
      if (response.data && response.data.errCode === 0) {
        setWorkTypes((prev) =>
          prev.filter((workType) => workType.code !== code)
        );
        setTotalCount((prev) => prev - 1);
      } else {
        console.error(
          "Failed to delete job type:",
          response.data.errMessage || "No message"
        );
      }
    } catch (error) {
      console.error("Error deleting job type:", error);
    }
  };

  // Filter work types based on search term
  const filteredWorkTypes = workTypes.filter((workType) =>
    workType.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorkTypes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredWorkTypes.length / itemsPerPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="border border-blue-gray-100 shadow-sm rounded-lg">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              type="text"
              placeholder="Search by type..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon sx={{ color: "gray" }} />
            </div>
          </div>
          <Button
            onClick={() => setSearchTerm("")}
            className="p-3 text-white bg-third hover:bg-primary rounded-md"
          >
            Reset Search
          </Button>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="p-3 bg-third hover:text-white text-white rounded-md"
        >
          Create
        </Button>
      </div>

      <Table className="table-auto w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">STT</TableHead>
            <TableHead className="text-center">Type of Work</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((workType, index) => (
            <TableRow key={workType.code}>
              <TableCell className="text-center">
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </TableCell>
              <TableCell className="text-center">{workType.value}</TableCell>
              <TableCell className="text-center flex space-x-3 items-center justify-center">
                <Button
                  onClick={() => handleOpenUpdateModal(workType)}
                  className="text-white bg-third hover:bg-primary rounded-md w-10 h-9"
                >
                  <EditNoteOutlinedIcon />
                </Button>

                <Button
                  onClick={() => handleDelete(workType.code)}
                  className="text-white bg-red-500 hover:bg-red-600 rounded-md w-10 h-9"
                >
                  <DeleteIcon />
                </Button>
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
                onPageChange={setCurrentPage} // Update currentPage when page changes
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Dialog for create type of work */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCloseCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Type of Work</DialogTitle>
            <DialogDescription>
              Enter the information of the work type to create.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="value">Type of Work</Label>
                <Input
                  id="value"
                  name="value"
                  value={newWorkType.value}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={newWorkType.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="bg-third hover:text-white text-white rounded-md"
              >
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for update type of work */}
      <Dialog open={isUpdateModalOpen} onOpenChange={handleCloseUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Type of Work</DialogTitle>
            <DialogDescription>
              Enter the new information of the work type.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="value">Type of Work</Label>
                <Input
                  id="value"
                  name="value"
                  value={updateWorkType.value}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={updateWorkType.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="bg-third hover:text-white text-white rounded-md"
              >
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageWorkForm;
