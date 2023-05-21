import { getUser } from "@/lib/auth";
import Image from "next/image";

export function Profile() {
  const user = getUser();

  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={user.avatarUrl}
        alt={user.name}
        width={500}
        height={500}
        className="h-10 w-10 rounded-full"
      />

      <p className="max-w-[140px] text-sm leading-snug">
        {user.name}
        <a
          href="/api/auth/logout"
          className="block font-bold text-gray-200 underline transition-colors hover:text-gray-50"
        >
          Sair
        </a>
      </p>
    </div>
  );
}
