import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { useBack } from "@refinedev/core";
import { departmentSchema } from "@/lib/schema";
import z from "zod";

const DepartmentsEdit = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(departmentSchema),
    refineCoreProps: {
      resource: "departments",
      action: "edit",
    },
  });

  const {
    refineCore: { onFinish, query },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const departmentData = query?.data?.data;

  const onSubmit = async (values: z.infer<typeof departmentSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  return (
    <EditView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Edit Department</h1>
      <div className="intro-row">
        <p>Update the department information below.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>
      <Separator />
      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Edit Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            {departmentData && (
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter department name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter department code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter department description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};

export default DepartmentsEdit;
