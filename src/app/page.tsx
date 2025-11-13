import { Button } from "@/components/ui/button";
import { auth0 } from "@/lib/auth0";
import { cn } from "@/lib/utils";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth0.getSession();

  return (
    <section className="relative flex h-screen w-full items-center justify-center bg-white dark:bg-black">
      {/* <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1.2px,transparent_1.2px)]"
        )}
      /> */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:60px_60px] 2xl:[background-size:80px_80px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#1e1e1e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e1e_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="max-w-2xl md:max-w-5xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl 2xl:text-8xl bg-clip-text text-primary text-center font-sans font-bold">
          Law & Verdict
        </h1>
        <p className="text-muted-foreground max-w-xl 2xl:max-w-2xl mx-auto my-8 text-sm md:text-xl 2xl:text-2xl text-center relative z-10">
          On a mission to build the most user-friendly search engine for lawyers
        </p>

        <p className="text-muted-foreground max-w-xl 2xl:max-w-2xl mx-auto my-8 text-sm md:text-xl 2xl:text-2xl text-center relative z-10">
          {!session ? (
            <a href="/auth/login">
              <Button>
                Sigin to continue{" "}
                <ArrowRightCircle className="size-4 2xl:size-6" />
              </Button>
            </a>
          ) : (
            <Link href="/dashboard">
              <Button>
                Access your dashboard{" "}
                <ArrowRightCircle className="size-4 2xl:size-6" />
              </Button>
            </Link>
          )}
        </p>
      </div>
    </section>
  );
}
