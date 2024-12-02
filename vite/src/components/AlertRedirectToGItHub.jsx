import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import profileImg from "../assets/profile.png";

import { IoLogoGithub } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export function AlertRedirectToGitHub({ children }) {
  const openGitHub = () => {
    window.open(
      "https://github.com/kavinduUdhara/chrommy",
      "_blank",
      "noopener,noreferrer"
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-md">
        <AlertDialogCancel className="w-8 h-8 rounded-full flex absolute right-4 top-4 border-none shadow-md bg-blue-50">
          <IoClose />
        </AlertDialogCancel>
        <AlertDialogHeader className="flex flex-col items-start w-full gap-2 pt-5">
          <AlertDialogTitle className="flex flex-col gap-5 items-center sm:flex-row duration-300">
            <div className="overflow-hidden max-w-36 rounded-full p-[1px] bg-white shadow-md">
              <img src={profileImg} alt="Profile" />
            </div>
            <div className="-space-y-[1px] flex flex-col items-start">
              <div className="text-slate-500 text-sm">github.com/</div>
              <div className="text-lg font-bold">kavinduUdhara</div>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-justify">
            I’m{" "}
            <a
              href="https://www.linkedin.com/in/kavindu-udhara/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-slate-600"
            >
              Kavindu Udhara
            </a>
            , the creator of this Chrome extension. It’s open source, so if
            you’re curious about how it works, go ahead and click the "Source
            Code" button to check it out!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={openGitHub}>
            <IoLogoGithub />
            Source Code
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
