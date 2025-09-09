/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useState } from "react";
import { ModeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import "./css/index.css";
import { PencilIcon, SquarePen, TrashIcon } from "lucide-react";
import { deleteDiary, getAllDiary, searchDiaryPrefix } from "./lib/db";
import { NavLink } from "react-router";
import type { DiaryTypes } from "./types/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import { Skeleton } from "./components/ui/skeleton";
import { useDebounce } from "./hooks/useDebounce";
import { toast } from "sonner";
// import dayjs from "dayjs";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const { debounced, lastDebounced } = useDebounce(search, 1000);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const searchDiaries = async () => {
    const diaries = await searchDiaryPrefix(debounced);
    setDiaries(diaries);
  };
  useEffect(() => {
    if (
      (debounced && lastDebounced === "") ||
      (debounced && lastDebounced) ||
      (debounced === "" && lastDebounced)
    ) {
      // console.log("🔥 Panggil API dengan:", debounced);
      searchDiaries();
    }
  }, [debounced]);

  const getDiaries = async () => {
    const entry = await getAllDiary();
    setDiaries(entry);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  useLayoutEffect(() => {
    getDiaries();
  }, []);

  return (
    <div className={"min-h-dvh max-w-3xl m-auto p-4"}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className={"text-2xl font-bold"}>My Diary</h1>
        <div className="flex items-center gap-2">
          <NavLink to={"/add-note"}>
            <Button variant="outline" size="default" className="rounded-full">
              <span>Add New Note</span>
              <PencilIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </NavLink>
          <ModeToggle />
        </div>
      </div>
      <div className="mt-4">
        <Input
          placeholder="Search Diary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className="h-[250px]" key={`skeleton-${index}`} />
            ))}
          </div>
        ) : diaries.length === 0 ? (
          <div className="text-center">
            <p>No diaries found</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 gap-4">
            {diaries.map((item: DiaryTypes, index: number) => (
              <div className="break-inside-avoid mb-4" key={`diary-${index}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      {dayjs(item.date).format("MMM DD, YYYY")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      dangerouslySetInnerHTML={{ __html: item.content }}
                      className="max-h-[100px] line-clamp-4"
                    />
                  </CardContent>
                  <CardFooter className="gap-2">
                    <NavLink to={`/edit-note/${item.id}`}>
                      <Button variant="default" size="icon">
                        <SquarePen className="h-[1.2rem] w-[1.2rem]" />
                      </Button>
                    </NavLink>
                    <Dialog
                      open={openDialogDelete}
                      onOpenChange={() => setOpenDialogDelete(true)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <TrashIcon className="h-[1.2rem] w-[1.2rem]" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Delete Diary</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this diary?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center gap-2">
                          <div className="grid flex-1 gap-2">
                            <Button
                              variant="destructive"
                              onClick={() => {
                                deleteDiary(item.id);
                                getDiaries();
                                toast.success("Diary has been deleted");
                                setOpenDialogDelete(false);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
