"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { z } from "zod";
import constant from "lodash/constant";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const callThis = (func: Function, ...args: unknown[]) => {
  return () => {
    func(...args);
  };
};

export function GoogleLogin() {
  const login = async () => {
    const googleResponse = await fetch(
      "https://connzy-api.liara.run/api/oauth/google?link=http://localhost:3000/api/callback"
    );
    const authData = await googleResponse.json();
    const validateAuthData = z
      .object({
        data: z.string(),
      })
      .parse(authData);
    console.log({ validateAuthData });

    window.location.replace(validateAuthData.data);
    return validateAuthData;
  };

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Button
          onClick={callThis(loginMutation.mutateAsync)}
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
