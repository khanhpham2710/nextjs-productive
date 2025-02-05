import { buttonVariants } from '@/components/ui/button';
import { LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from 'next/link';


export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border mt-52 px-12">
          <div className="container py-6 sm:py-12 max-w-screen-2xl border-t border-border flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4">
            <div className="text-center space-y-0.5 sm:text-left">
              <p className="font-semibold sm:text-lg">
                Made with <span className="text-primary">love</span>
              </p>
              <p className="text-muted-foreground">@ 2024 SuperProductive</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Link
                href={"/"}
                target="_blank"
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <GitHubLogoIcon />
              </Link>
              <Link
                href={"/"}
                target="_blank"
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <LinkedInLogoIcon />
              </Link>
            </div>
          </div>
        </footer>
      );
}
