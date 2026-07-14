const demoDkimPublicKey =
  "v=DKIM1; k=rsa; p=REPLACE_WITH_GENERATED_PUBLIC_KEY_AFTER_MAIL_STACK_IS_ENABLED";

export function buildDnsRecords(domain, hostname, selector = "default") {
  return [
    {
      type: "MX",
      host: domain,
      value: `10 ${hostname}`,
      purpose: "Routes inbound email for this domain to your E-Mailer server.",
    },
    {
      type: "TXT",
      host: domain,
      value: `v=spf1 mx -all`,
      purpose: "Allows only your MX server to send mail for this domain.",
    },
    {
      type: "TXT",
      host: `${selector}._domainkey.${domain}`,
      value: demoDkimPublicKey,
      purpose: "Publishes the DKIM public key used to verify signed outbound mail.",
    },
    {
      type: "TXT",
      host: `_dmarc.${domain}`,
      value: "v=DMARC1; p=quarantine; rua=mailto:postmaster@" + domain,
      purpose: "Tells receivers how to handle mail that fails SPF or DKIM checks.",
    },
    {
      type: "A",
      host: hostname,
      value: "YOUR_SERVER_IPV4",
      purpose: "Points the mail hostname to your server IPv4 address.",
    },
  ];
}
