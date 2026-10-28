import { useState } from "react";
import { useNavigate } from "react-router";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogIn, ArrowLeft } from "lucide-react";
import { BACKEND_BASE_URL } from "@/constants";

const StudentJoin = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/classes/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ inviteCode: code }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? json.error ?? "Failed to join class");
      }

      navigate("/student/classes");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ListView>
      <Breadcrumb />
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Join a Class
          </CardTitle>
          <CardDescription>
            Enter the invite code provided by your teacher to join their class.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                placeholder="e.g. abc1234"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Joining..." : "Join Class"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </ListView>
  );
};

export default StudentJoin;
