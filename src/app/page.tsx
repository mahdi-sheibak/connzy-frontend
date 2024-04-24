import { GoogleLogin } from "@/components/google-login";

export default function HomePage() {
  return (
    <main className="flex flex-col justify-center items-center h-[100vh]">
      <GoogleLogin />
    </main>
  );
}
