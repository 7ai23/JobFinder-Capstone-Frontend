import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useRef } from "react";
import ScamMoney from "../../../assets/illustration/report/money.png";
import ScamIdentity from "../../../assets/illustration/report/identity.png";
import ScamFake from "../../../assets/illustration/report/fake.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createNewReport } from "@/fetchData/Report";
import toast from "react-hot-toast";

function Report({ data }) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const [selectedReasons, setSelectedReasons] = useState([]);
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCheckboxChange = (values) => {
    setSelectedReasons(values);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const createReport = async () => {
    const reportData = {
      userId: localStorage.getItem("user_id"),
      postId: data.data.id,
      reason: selectedReasons.join(", "),
      description: description,
    };

    if (!reportData.userId) {
      toast.error("Please login before reporting!");
    } else {
      const report = await createNewReport(reportData);
      if (report.data.errorCode === -1) {
        console.log("rp data", report);
        toast.error(report.data.errMessage);
        setSelectedReasons([]);
        setDescription("");
      } else {
        toast.success("Report successfully!");
        setSelectedReasons([]);
        setDescription("");
        setIsDialogOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-lg font-semibold">Identifying Some Types of Scams</p>
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-xs"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          <CarouselItem>
            <div className="p-1 border-none">
              <Card className="border-none shadow-none">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="flex flex-col space-y-4">
                    <img
                      src={ScamMoney}
                      alt=""
                      className="border border-primary rounded-lg"
                    />
                    <span className="text-lg font-semibold flex flex-col">
                      <div>Advance-fee scam</div>
                      <div className="text-sm font-normal">
                        Offering overly easy job opportunities with high
                        benefits, but requiring a fee during the process
                      </div>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1 border-none">
              <Card className="border-none shadow-none">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="flex flex-col space-y-4">
                    <img
                      src={ScamIdentity}
                      alt=""
                      className="border border-primary rounded-lg"
                    />
                    <span className="text-lg font-semibold flex flex-col">
                      <div>Stealing user information</div>
                      <div className="text-sm font-normal">
                        Asking for personal documents and email to fraudulently
                        use someone identity
                      </div>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1 border-none">
              <Card className="border-none shadow-none ">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="flex flex-col space-y-4">
                    <img
                      src={ScamFake}
                      alt=""
                      className="border border-primary rounded-lg"
                    />
                    <div className="text-lg font-semibold flex flex-col gap-2">
                      <div>Impersonation of major corporations</div>
                      <div className="text-sm font-normal">
                        Publishing fraudulent job listings under the names of
                        well-known companies and directly contacting job seekers
                        with misleading information.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border border-primary text-primary hover:bg-primary hover:text-white w-full max-w-sm"
          >
            Report Scam
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Scam</DialogTitle>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createReport();
                }}
              >
                <div className="mt-4">
                  <div className="flex gap-2">
                    <div className="p-8 lg:p-8 md:p-6 sm:p-4 bg-gray-300 text-center">
                      Logo
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-primary">
                        {data.data.postDetailData?.name}
                      </div>
                      <div className="font-semibold text-lg text-black">
                        {data.data.companyData?.name}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <CheckboxGroup
                      value={selectedReasons}
                      onChange={handleCheckboxChange}
                    >
                      <Checkbox value="Wrong company address">
                        Wrong company address
                      </Checkbox>
                      <Checkbox value="I have problem applying this job">
                        I have problem applying this job
                      </Checkbox>
                      <Checkbox value="Scam issues">Scam issues</Checkbox>
                      <Checkbox value="Others">Others</Checkbox>
                    </CheckboxGroup>
                  </div>
                  <div className="grid w-full gap-2 mt-8">
                    <Textarea
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder=" Describe the reason you report..."
                    />

                    <Button
                      variant="outline"
                      className="border border-primary text-primary hover:bg-primary hover:text-white"
                      type="submit"
                    >
                      Send Report
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Report;
