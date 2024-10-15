import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardBody, Image, Slider } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getDetailPostById } from "@/fetchData/Post";
import { Separator } from "@/components/ui/separator";
import { FavoriteRounded } from "@mui/icons-material";

function TooltipBox({ id }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await getDetailPostById(id);
        const fetchedData = response.data.data;

        if (Array.isArray(fetchedData)) {
          setData(fetchedData);
        } else {
          setData([fetchedData]);
        }
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPosts();
  }, [id]);
  return (
    <div className="flex flex-col gap-2 w-full max-w-xl p-2">
      {data.map((card, index) => (
        <ScrollArea key={index}>
          <div className="flex  gap-6 items-center">
            <div className="relative bg-transparent">
              <Image
                alt="Album cover"
                className="object-cover rounded-lg"
                height={100}
                shadow="md"
                src="https://nextui.org/images/album-cover.png"
                width={100}
              />
            </div>

            <div className="flex flex-col -mt-10">
              <h1 className="text-large font-medium ">
                {card.companyData.name}
              </h1>
              <h3 className="font-normal text-gray-500">
                {card.postDetailData.name}
              </h3>
            </div>
          </div>
          <div className="flex gap-2 my-4">
            <Badge variant="outline" className="bg-white w-fit text-nowrap">
              {card.postDetailData.salaryTypePostData.value}
            </Badge>
            <Badge variant="outline" className="bg-white w-fit text-nowrap">
              {card.postDetailData.provincePostData.value}
            </Badge>
          </div>
          <div className="mb-2">
            <div className="text-base font-semibold border-l-4 border-primary pl-2 mb-2">
              Job Description
            </div>
            <ul className="list-disc list-inside text-wrap space-y-2">
              <li>{card.postDetailData.description}</li>
              <li>Work time: {card.postDetailData.workTypePostData.value}</li>
              <li>Salary: {card.postDetailData.salaryTypePostData.value}</li>
            </ul>
          </div>

          <div className="mb-2">
            <div className="text-base font-semibold border-l-4 border-primary pl-2 mb-2">
              Candidate requirements
            </div>
            <ul className="list-disc list-inside text-wrap space-y-2">
              <li>Experience: {card.postDetailData.expTypePostData.value}</li>
            </ul>
          </div>

          <div className="mb-2">
            <div className="text-base font-semibold border-l-4 border-primary pl-2 mb-2">
              Working Address
            </div>
            <ul className="list-disc list-inside text-wrap space-y-2">
              <li>{card.companyData.address}</li>
            </ul>
          </div>
        </ScrollArea>
      ))}

      {/* footer */}
      <div className="w-full flex gap-2 mt-4">
        <Button
          variant="outline"
          className="w-4/5 border-primary text-center text-primary hover:bg-primary hover:text-white text-base font-medium"
        >
          Apply
        </Button>
        <Button className="w-1/5 text-center bg-primary text-white hover:bg-primary/70 text-base font-medium">
          <FavoriteRounded />
        </Button>
      </div>
    </div>
  );
}

export default TooltipBox;
