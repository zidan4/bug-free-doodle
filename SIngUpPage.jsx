
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      await signIn("credentials", { email: formData.email, password: formData.password, redirect: false });
      router.push("/dashboard");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 p-5 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full">Sign Up</Button>
          </form>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" onClick={() => signIn("google")}>Sign Up with Google</Button>
            <Button variant="outline" onClick={() => signIn("github")}>Sign Up with GitHub</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
