import {
  Refine,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth-provider";
import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import { Header } from "./components/refine-ui/layout/header";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import "./App.css";
import Dashboard from "./pages/dashboard";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import TeacherDashboard from "./pages/teacher/dashboard";
import TeacherClassesList from "./pages/teacher/classes/list";
import TeacherClassesCreate from "./pages/teacher/classes/create";
import TeacherClassesShow from "./pages/teacher/classes/show";
import StudentDashboard from "./pages/student/dashboard";
import StudentClassesList from "./pages/student/classes/list";
import StudentBrowse from "./pages/student/browse";
import StudentJoin from "./pages/student/join";
import StudentProfile from "./pages/student/profile";
import { BookOpen, GraduationCap, Home, Building2, Users } from "lucide-react";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsList from "./pages/subjects/list";
import SubjectsEdit from "./pages/subjects/edit";
import SubjectsShow from "./pages/subjects/show";
import ClassesCreate from "./pages/classes/create";
import ClassesList from "./pages/classes/list";
import ClassesShow from "./pages/classes/show";
import ClassesEdit from "./pages/classes/edit";
import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentsEdit from "./pages/departments/edit";
import UsersList from "./pages/users/list";
import UsersCreate from "./pages/users/create";
import UsersEdit from "./pages/users/edit";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "U3Bhuv-yf9B2J-Lgf1MT",
              }}

              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Home",
                    icon: <Home />,
                  },
                },

                {
                  name: "departments",
                  list: "/departments",
                  create: "/departments/create",
                  edit: "/departments/edit/:id",
                  meta: {
                    label: "Departments",
                    icon: <Building2 />,
                  },
                },

                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  edit: "/subjects/edit/:id",
                  show: "/subjects/show/:id",
                  meta: {
                    label: "Subjects",
                    icon: <BookOpen/>
                  },
                },

                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  edit: "/classes/edit/:id",
                  show: '/classes/show/:id',
                  meta: {
                    label: "Classes",
                    icon: <GraduationCap/>
                  },
                },

                {
                  name: "users",
                  list: "/users",
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  meta: {
                    label: "Users",
                    icon: <Users />,
                  },
                }
                

              ]}
            >
              <Routes>
                {/* Auth pages — no layout wrapper */}
                <Route path="/login" element={<SignInPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected pages — with layout */}
                <Route
                  element={
                    <Authenticated key="authenticated-layout">
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<Dashboard />} />

                  <Route path="/departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="edit/:id" element={<DepartmentsEdit />} />
                  </Route>

                  <Route path="/subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="edit/:id" element={<SubjectsEdit />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>

                  <Route path="/classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="edit/:id" element={<ClassesEdit />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>

                  <Route path="/users">
                    <Route index element={<UsersList />} />
                    <Route path="create" element={<UsersCreate />} />
                    <Route path="edit/:id" element={<UsersEdit />} />
                  </Route>

                  {/* Teacher routes */}
                  <Route path="/teacher">
                    <Route index element={<TeacherDashboard />} />
                    <Route path="classes">
                      <Route index element={<TeacherClassesList />} />
                      <Route path="create" element={<TeacherClassesCreate />} />
                      <Route path="show/:id" element={<TeacherClassesShow />} />
                    </Route>
                  </Route>

                  {/* Student routes */}
                  <Route path="/student">
                    <Route index element={<StudentDashboard />} />
                    <Route path="classes">
                      <Route index element={<StudentClassesList />} />
                      <Route path="show/:id" element={<ClassesShow />} />
                    </Route>
                    <Route path="browse" element={<StudentBrowse />} />
                    <Route path="join" element={<StudentJoin />} />
                    <Route path="profile" element={<StudentProfile />} />
                  </Route>
                </Route>

                {/* Catch-all: redirect unauthenticated to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
