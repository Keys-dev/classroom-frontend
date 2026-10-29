"use client";

import { ArrowLeft, Mail } from "lucide-react";

import { useLink } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const CheckEmailForm = () => {
  const Link = useLink();

  return (
    <div
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "px-6",
        "py-8",
        "min-h-svh"
      )}
    >
      <Card className={cn("sm:w-[456px]", "p-12", "mt-6")}>
        <CardHeader className={cn("px-0", "text-center")}>
          <div className={cn("flex", "justify-center", "mb-4")}>
            <div
              className={cn(
                "flex",
                "items-center",
                "justify-center",
                "w-16",
                "h-16",
                "rounded-full",
                "bg-blue-100",
                "dark:bg-blue-900"
              )}
            >
              <Mail className={cn("w-8", "h-8", "text-blue-600", "dark:text-blue-400")} />
            </div>
          </div>
          <CardTitle
            className={cn(
              "text-blue-600",
              "dark:text-blue-400",
              "text-3xl",
              "font-semibold"
            )}
          >
            Check your email
          </CardTitle>
          <CardDescription
            className={cn("text-muted-foreground", "font-medium", "text-base", "mt-2")}
          >
            We've sent a password reset link to your email address. Check your inbox and follow the instructions to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className={cn("px-0")}>
          <div className={cn("flex", "flex-col", "gap-4", "mt-2")}>
            <Button
              asChild
              size="lg"
              className={cn("w-full")}
            >
              <Link to="/login">Back to sign in</Link>
            </Button>

            <div className={cn("flex", "justify-center", "mt-2")}>
              <Link
                to="/forgot-password"
                className={cn(
                  "inline-flex",
                  "items-center",
                  "gap-2",
                  "text-sm",
                  "text-muted-foreground",
                  "hover:text-foreground",
                  "transition-colors"
                )}
              >
                <ArrowLeft className={cn("w-4", "h-4")} />
                <span>Didn't receive the email? Request again</span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

CheckEmailForm.displayName = "CheckEmailForm";
