import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { Subject } from "@/types";

const SubjectsShow = () => {
  const { id } = useParams<{ id: string }>();
  const { query } = useShow<Subject>({
    resource: "subjects",
    id: id ?? "1",
  });

  const { data, isLoading, isError } = query;
  const subject = data?.data;

  if (isLoading) {
    return <p className="state-message">Loading...</p>;
  }

  if (isError || !subject) {
    return <p className="state-message">Failed to load subject details.</p>;
  }

  return (
    <ShowView>
      <ShowViewHeader title="Subject Details" />
      <Breadcrumb />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>{subject.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">Code:</span>
              <Badge>{subject.code}</Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Description</p>
              <p className="text-foreground">{subject.description ?? "—"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Department</p>
              <Badge variant="secondary">
                {(subject as any).departments?.name ?? subject.department ?? "—"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default SubjectsShow;
