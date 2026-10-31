import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-svh flex-1 bg-muted/40 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Link href="/" className="flex w-fit items-center gap-2 font-bold">
          <Image src="/assets/logo.svg" alt="" width={28} height={28} />
          RentFlow
        </Link>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <div className="hidden p-4 lg:block">
        <div className="relative size-full overflow-hidden rounded-2xl">
          <Image
            src="/assets/auth-image.png"
            alt="Modern glass house reflected in a pool at dusk"
            fill
            preload
            sizes="(min-width: 1024px) 55vw, 0px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
