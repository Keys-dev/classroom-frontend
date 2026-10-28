import { useParams } from "react-router";
import ClassesShow from "@/pages/classes/show";

// Teacher class detail reuses the same show page as admin
const TeacherClassesShow = () => {
  const { id } = useParams();
  return <ClassesShow />;
};

export default TeacherClassesShow;
