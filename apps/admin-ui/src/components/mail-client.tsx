"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Ban,
  CircleHelp,
  Inbox,
  List,
  Mail,
  Reply,
  RotateCw,
  Search,
  Send,
  Server,
  Settings,
  Trash2,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const messages = [
  {
    sender: "E-Mailer Setup",
    time: "09:24",
    subject: "DNS records are ready for your domain",
    preview: "MX, SPF, DKIM, DMARC and mail host records were generated.",
    kicker: "Setup assistant",
    body: "Your domain setup package is ready. Publish MX, SPF, DKIM and DMARC records at your DNS provider, then return to the admin console for verification.",
  },
  {
    sender: "Postmaster",
    time: "08:12",
    subject: "Deliverability baseline configured",
    preview: "Your server identity is ready for the next verification pass.",
    kicker: "Postmaster",
    body: "Server identity checks are prepared. Reverse DNS, HELO hostname and outbound policy checks will be validated once the mail stack is enabled.",
  },
  {
    sender: "Security Monitor",
    time: "Yesterday",
    subject: "Admin login protection is enabled",
    preview: "Session hardening and audit events are prepared for the console.",
    kicker: "Security",
    body: "Admin sessions, audit trails and sign-in hardening are separated from webmail. Mail users do not share the same control plane as server administrators.",
  },
  {
    sender: "Mailbox Engine",
    time: "Jul 14",
    subject: "IMAP service placeholder connected",
    preview: "Dovecot integration is planned in the next milestone.",
    kicker: "Mailbox engine",
    body: "The current MVP keeps the visual mailbox ready while Dovecot integration is still planned. The UI contract is independent from admin setup.",
  },
  {
    sender: "Spam Control",
    time: "Jul 14",
    subject: "Rspamd module awaiting activation",
    preview: "DKIM signing and spam rules will move into the mail stack layer.",
    kicker: "Spam control",
    body: "Spam filtering and DKIM signing will live in the server stack. The mailbox interface will only display results and user-level actions.",
  },
];

const folders = [
  { label: "Inbox", count: "18", icon: Inbox },
  { label: "Drafts", count: "2", icon: List },
  { label: "Sent", icon: Send },
  { label: "Spam", icon: Ban },
  { label: "Trash", icon: Trash2 },
  { label: "Archive", icon: Archive },
];

export function MailClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = useMemo(() => messages[activeIndex], [activeIndex]);

  return (
    <main className="mail-app">
      <header className="mail-topbar">
        <Brand />

        <nav className="mode-switcher" aria-label="Workspace">
          <Button asChild variant="secondary" size="icon" className="is-active" title="Mail">
            <Link href="/mail">
              <Mail aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" title="Admin">
            <Link href="/admin">
              <Server aria-hidden="true" />
            </Link>
          </Button>
        </nav>

        <label className="mail-search">
          <Search aria-hidden="true" />
          <input type="search" placeholder="Search mail" />
        </label>

        <div className="topbar-actions">
          <Button variant="ghost" size="icon" title="Help">
            <CircleHelp aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" title="Refresh">
            <RotateCw aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" title="Settings">
            <Settings aria-hidden="true" />
          </Button>
          <button className="avatar-button" type="button" aria-label="Account">
            L
          </button>
        </div>
      </header>

      <aside className="mail-sidebar" aria-label="Mail folders">
        <Button className="compose-button">Compose</Button>

        <nav className="folder-list">
          {folders.map((folder, index) => {
            const Icon = folder.icon;

            return (
              <a className={index === 0 ? "folder active" : "folder"} href={`#${folder.label.toLowerCase()}`} key={folder.label}>
                <Icon aria-hidden="true" />
                <span>{folder.label}</span>
                {folder.count ? <strong>{folder.count}</strong> : null}
              </a>
            );
          })}
        </nav>

        <section className="sidebar-note">
          <div className="note-title">
            <strong>E-Mailer Updates</strong>
            <span>Open</span>
          </div>
          <p>Product releases, account notices, and delivery reports.</p>
        </section>

        <section className="storage-panel">
          <div className="storage-head">
            <strong>Storage</strong>
            <Button variant="secondary" size="sm">
              Add
            </Button>
          </div>
          <div className="storage-bar">
            <span />
          </div>
          <div className="storage-meta">
            <span>420 MB of 10 GB</span>
            <span>4%</span>
          </div>
        </section>
      </aside>

      <section className="message-list" aria-label="Inbox messages">
        <div className="list-header">
          <div>
            <p>Inbox</p>
            <h1>Mail</h1>
          </div>
          <Button variant="secondary" size="sm">
            Today
          </Button>
        </div>

        {messages.map((message, index) => (
          <button
            className={index === activeIndex ? "message active" : "message"}
            key={message.subject}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <div className="sender-row">
              <strong>{message.sender}</strong>
              <time>{message.time}</time>
            </div>
            <h2>{message.subject}</h2>
            <p>{message.preview}</p>
          </button>
        ))}
      </section>

      <section className="reader" aria-label="Selected message">
        <div className="reader-toolbar">
          <div>
            <p>
              {active.sender} · {active.time}
            </p>
            <h2>{active.subject}</h2>
          </div>
          <div className="reader-actions">
            <Button variant="secondary" size="icon" title="Archive">
              <Archive aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="icon" title="Reply">
              <Reply aria-hidden="true" />
            </Button>
          </div>
        </div>

        <Card className="mail-card">
          <CardContent>
            <div className="mail-empty-icon" aria-hidden="true" />
            <p className="mail-kicker">{active.kicker}</p>
            <h3>{active.subject}</h3>
            <p>{active.body}</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
