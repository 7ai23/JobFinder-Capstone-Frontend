import JobCard from "./Common/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Pagination, Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import {
  getAllCode,
  getAllCodeByType,
  getValueByCode,
} from "@/fetchData/AllCode";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllPost,
  getAllPostsInactive,
  getAllPostWithLimit,
} from "@/fetchData/Post";
import JobPagination from "../Jobpage/JobPagination";

function BestJob() {
  const [sort, setSort] = useState([]);
  const [sortValue, setSortValue] = useState([]);
  const [selectedType, setSelectedType] = useState("PROVINCE");
  const [isLoading, setIsLoading] = useState(true);
  const [select, setSelect] = useState();

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const loadPosition = document.documentElement.scrollHeight - 2300;
    if (scrollPosition >= loadPosition) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSort = async () => {
      try {
        const response = await getAllCode();
        const jobData = response.data.data;
        setSort(jobData);
        console.log("Job data", jobData);

        if (selectedType) {
          const response2 = await getAllCodeByType(selectedType);
          setSortValue(response2.data.data);
          console.log(response2.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    window.addEventListener("scroll", handleScroll);
    if (!isLoading) {
      fetchSort();
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedType, isLoading]);

  const requiredTypes = [
    "SALARYTYPE",
    "EXPIERNCETYPE",
    "PROVINCE",
    "JOBTYPE",
    "WORKTYPE",
    "JOBLEVEL",
  ];
  const uniqueTypes = [...new Set(sort.map((item) => item.type))];

  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [currentJobs, setCurrentJobs] = useState([]);
  const itemsPerPage = 6;
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const [data, setData] = useState([]);

  const fetchAllPosts = async (page) => {
    const date = new Date();
    try {
      const response = await getAllPost();
      const fetchedData = response.data.data;
      const allHotJobs = fetchedData.filter(
        (all) => all.isHot === 1 && date < new Date(all.timeEnd)
      );
      console.log("data 123", allHotJobs.length);

      if (allHotJobs) {
        setData(allHotJobs);
        console.log("index", indexOfFirstJob, indexOfLastJob);

        const currentJob = allHotJobs.slice(indexOfFirstJob, indexOfLastJob);

        // const isHotJobs = currentJob.filter(
        //   (job) => job.isHot === 1 && date < new Date(job.timeEnd)
        // );
        setCurrentJobs(currentJob);

        console.log("current", allHotJobs);
        setTotalPages(Math.ceil(allHotJobs.length / itemsPerPage)); // Set total pages
        console.log("total", totalPages);
      } else {
        console.error("No data received for current page:", page);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch posts on page change
  useEffect(() => {
    setIsLoading(true);
    fetchAllPosts(currentPage);
  }, [currentPage]);

  const handleSortByValue = async (code, index) => {
    try {
      const response = await getAllPostsInactive(code);
      setData(response.data.data);

      setSelect(index);

      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col bg-white pb-8 mb-24 mt-10 mx-10 sm:mx-12 md:mx-16 xl:mx-36 font-poppins rounded-lg border-[1px] border-primary">
      <div className="flex items-center justify-between text-4xl md:text-5xl font-forum mb-4 font-semibold text-start bg-[#4a3d8d] bg-opacity-70 rounded-t-lg p-6">
        <div>
          Best <span className="text-secondary">Job</span> For You
        </div>
        <div className="text-secondary text-base font-poppins font-light mr-4 hover:underline hover:underline-offset-1">
          <Link to="/jobs">See All Jobs </Link>
        </div>
      </div>
      {/* Sort and carousel */}
      <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full mx-4 space-y-4 lg:space-y-0 mt-4">
        <Select
          className="flex items-center"
          onValueChange={(type) => setSelectedType(type)}
        >
          <SelectTrigger className="w-4/5 sm:w-4/5 md:w-4/5 lg:w-[200px] shrink basis-1/4 ">
            <FilterListIcon className="" />
            <SelectValue placeholder="Sort by" value={selectedType} />
          </SelectTrigger>
          <SelectContent>
            {uniqueTypes
              .filter((type) => requiredTypes.includes(type))
              .map((type, index) => (
                <SelectItem key={index} value={type}>
                  {type}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <div className="w-[95%] basis-1/2 px-20 flex-shrink">
          <Carousel className="w-[96%] xl:w-[600px]">
            <CarouselContent className="flex">
              {sortValue.map((value, index) => (
                <CarouselItem key={index} className="basis-1/3 items-center">
                  <Card
                    onClick={() => handleSortByValue(value.code, index)}
                    className={`h-10 text-center text-black rounded-3xl cursor-pointer hover:bg-primary hover:text-white flex justify-center ${
                      select === index ? "bg-primary text-white" : ""
                    } `}
                  >
                    <button type="button" className="text-xs font-medium">
                      {value.value}
                    </button>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-2 border-primary text-primary bg-white hover:text-white hover:bg-primary" />
            <CarouselNext className="border-2 border-primary text-primary bg-white hover:text-white hover:bg-primary" />
          </Carousel>
        </div>
      </div>
      {/* Job cards */}
      <div className="w-full grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 py-10 px-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center md:items-start"
            >
              <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-3/4 sm:w-[250px] lg:w-[300px]" />
                <Skeleton className="h-4 w-1/2 sm:w-[200px] lg:w-[250px]" />
              </div>
            </div>
          ))
        ) : currentJobs && currentJobs.length > 0 ? (
          <JobCard expand="" data={currentJobs} />
        ) : (
          <>
            <div></div>
            <div className="w-full flex justify-center items-center text-gray-500">
              <p>No jobs available</p>
            </div>
          </>
        )}
      </div>
      {/* Pagination */}
      <JobPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default BestJob;
