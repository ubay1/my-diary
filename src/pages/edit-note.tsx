/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "../css/index.css";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getDiaryById, persistDB, updateDiary } from "@/lib/db";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import type { DiaryTypes } from "@/types/db";
import { useEffect } from "react";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getData = async (id: number) => {
    try {
      const data = await getDiaryById(id);
      if (data) {
        form.setValue("title", (data as DiaryTypes).title);
        form.setValue("created_at", dayjs((data as DiaryTypes)?.date).toDate());
        form.setValue("content", (data as DiaryTypes)?.content);
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

  // ===================== React Hook Form + Zod =================== //
  const schemaTest = z.object({
    title: z.string().min(1, {
      message: "Title is required",
    }),
    created_at: z.date({
      error: "Date is required",
    }),
    content: z.string().refine(
      (val) => {
        const clean = val.replace(/<[^>]*>?/gm, "").trim();
        return clean.length > 0;
      },
      {
        message: "Content is required",
      }
    ),
  });

  type FormValues = z.infer<typeof schemaTest>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schemaTest),
    defaultValues: {
      title: "",
      created_at: new Date(),
      content: "",
    },
  });

  const handleSave = (data: FormValues) => {
    // console.log("data values = ", data);
    updateDiary(
      Number(id),
      data.title,
      dayjs(data.created_at).format("YYYY-MM-DD"),
      data.content
    );
    form.reset();
    persistDB();
    toast.success("Note has been updated");
    navigate("/");
  };

  return (
    <div className={"min-h-dvh max-w-3xl m-auto p-4"}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="created_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created At</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                dayjs(field.value).format("MMMM DD, YYYY")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <div
                        className={`${
                          form.formState.errors.content
                            ? "rounded-[5px] border border-red-500"
                            : ""
                        }`}
                      >
                        <RichTextEditor
                          placeholder="Write your content here..."
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-2">
                <Button className="mt-4" type="submit">
                  Submit
                </Button>
                <Button
                  className="mt-4"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditNote;
