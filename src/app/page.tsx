'use client'

import { useUser } from "@/hooks/useUser";

export default function Home() {

  const { user, loading } = useUser();

  console.log(user, loading);

  return (
    <div>
      Home
    </div>
  );
}
