"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { List, Mail, Server, Shield } from "lucide-react";

import { Brand } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type DnsRecord = {
  type: string;
  host: string;
  value: string;
  purpose: string;
};

type Domain = {
  id: number;
  name: string;
  hostname: string;
  dnsRecords: DnsRecord[];
};

async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function AdminConsole() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");

  async function loadDomains() {
    try {
      const health = await api("/health");
      setStatus(health.ok ? "online" : "offline");
      const data = await api("/api/domains");
      setDomains(data.domains);
    } catch {
      setStatus("offline");
      setDomains([]);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name");
    const hostname = formData.get("hostname");

    await api("/api/domains", {
      method: "POST",
      body: JSON.stringify({ name, hostname: hostname || undefined }),
    });

    form.reset();
    await loadDomains();
  }

  useEffect(() => {
    loadDomains();
  }, []);

  return (
    <main className="admin-app">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Brand admin />

        <nav className="admin-nav">
          <a className="active" href="#domains">
            <Server aria-hidden="true" /> Domains
          </a>
          <a href="#mailboxes">
            <Mail aria-hidden="true" /> Mailboxes
          </a>
          <a href="#security">
            <Shield aria-hidden="true" /> Security
          </a>
          <a href="#logs">
            <List aria-hidden="true" /> Logs
          </a>
        </nav>

        <Button asChild variant="outline" className="back-to-mail">
          <Link href="/mail">Open Mail UI</Link>
        </Button>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <p>Server setup</p>
            <h1>Domain Setup</h1>
          </div>
          <Badge className={status === "online" ? "status-online" : status === "offline" ? "status-offline" : ""}>
            {status === "checking" ? "Checking API" : status === "online" ? "API online" : "API offline"}
          </Badge>
        </header>

        <section className="admin-layout">
          <Card className="domain-form-card">
            <CardHeader>
              <p className="form-kicker">New domain</p>
              <CardTitle>Add a mail domain</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="domain-form" onSubmit={onSubmit}>
                <label>
                  <span>Domain</span>
                  <Input name="name" placeholder="example.com" autoComplete="off" required />
                </label>
                <label>
                  <span>Mail hostname</span>
                  <Input name="hostname" placeholder="mail.example.com" autoComplete="off" />
                </label>
                <Button type="submit">Generate DNS records</Button>
              </form>
            </CardContent>
          </Card>

          <section className="admin-summary">
            <Card className="summary-card">
              <CardContent>
                <span>Domains</span>
                <strong>{domains.length}</strong>
              </CardContent>
            </Card>
            <Card className="summary-card">
              <CardContent>
                <span>Required DNS records</span>
                <strong>5</strong>
              </CardContent>
            </Card>
            <Card className="summary-card">
              <CardContent>
                <span>Supported OS</span>
                <strong>Debian / Ubuntu</strong>
              </CardContent>
            </Card>
          </section>
        </section>

        <section className="domain-list" id="domains" aria-live="polite">
          {domains.length === 0 ? (
            <Card className="empty-state">
              <CardContent>No domains yet. Add your first domain to generate DNS records.</CardContent>
            </Card>
          ) : (
            domains.map((domain) => (
              <Card className="domain-card" key={domain.id}>
                <CardHeader className="domain-card-head">
                  <div>
                    <CardTitle>{domain.name}</CardTitle>
                    <p>{domain.hostname}</p>
                  </div>
                  <Badge>DNS required</Badge>
                </CardHeader>
                <CardContent>
                  <div className="records">
                    {domain.dnsRecords.map((record) => (
                      <div className="record" key={`${record.type}-${record.host}`}>
                        <div className="record-type">{record.type}</div>
                        <div>
                          <code>
                            {record.host} -&gt; {record.value}
                          </code>
                          <small>{record.purpose}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
