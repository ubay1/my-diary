import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "../css/index.css";
import { toast } from "sonner";
import { getDiaryById } from "@/lib/db";
import dayjs from "dayjs";
import { NavLink, useNavigate, useParams } from "react-router";
import type { DiaryTypes } from "@/types/db";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

function DetailNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<DiaryTypes | undefined>();

  const getData = async (id: number) => {
    try {
      const data = await getDiaryById(id);
      if (data) {
        setData(data as DiaryTypes);
      }
    } catch (error) {
      console.log("error = ", error);
      toast.error("Error fetching data");
      return;
    }
  };
  useEffect(() => {
    if (id) {
      getData(Number(id));
    }
  }, [id]);

  return (
    <div className={"min-h-dvh max-w-3xl m-auto p-4"}>
      <Card>
        <CardHeader>
          <CardTitle>
            <NavLink
              className="flex items-center gap-2"
              to={`/`}
              onClick={() => navigate("/")}
            >
              <ArrowLeft />
              <div>Back</div>
            </NavLink>
            <div className="mt-8 flex flex-col gap-2">
              <div className="font-bold text-xl">{data?.title}</div>
              <div className="text-sm">
                {dayjs(data?.date).format("MMMM DD, YYYY")}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: data?.content || "" }}></div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DetailNote;
