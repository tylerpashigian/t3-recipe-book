import Link from "next/link";

export default function NavbarStatic() {
  return (
    <nav className="flex items-center gap-4 text-lg font-medium">
      <Link href="/" className="flex items-center gap-1 text-lg font-semibold">
        <img src="/forked-logo.png" alt="Logo" className="h-8 w-8" />
        <span>Forked</span>
      </Link>
    </nav>
  );
}
