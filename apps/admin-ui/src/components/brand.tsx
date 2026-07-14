import Image from "next/image";
import Link from "next/link";

export function Brand({ admin = false }: { admin?: boolean }) {
  return (
    <Link className="brand" href={admin ? "/admin" : "/mail"} aria-label={admin ? "E-Mailer Admin" : "E-Mailer Mail"}>
      <span className="brand-logo">
        <Image src="/brand/e-mailer-logo.png" alt="" width={34} height={34} priority />
      </span>
      <span>
        <span className="brand-word">E-Mailer</span>
        {admin ? <small>Admin Console</small> : null}
      </span>
    </Link>
  );
}
