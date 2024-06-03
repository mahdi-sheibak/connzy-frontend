"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction } from "@/actions/login";

export function GoogleLogin() {
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: loginAction,
    onSuccess: (response) => {
      window.location.replace(response.data);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Button
          onClick={() => loginMutation.mutateAsync()}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login With Google
        </Button>
      </CardContent>
    </Card>
  );
}
