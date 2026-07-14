const statusEl = document.querySelector("#api-status");
const domainListEl = document.querySelector("#domain-list");
const formEl = document.querySelector("#domain-form");
const templateEl = document.querySelector("#domain-template");
const domainCountEl = document.querySelector("#domain-count");

async function api(path, options = {}) {
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

function renderDomains(domains) {
  domainListEl.innerHTML = "";
  domainCountEl.textContent = String(domains.length);

  if (domains.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No domains yet. Add your first domain to generate DNS records.";
    domainListEl.append(empty);
    return;
  }

  for (const domain of domains) {
    const node = templateEl.content.cloneNode(true);
    node.querySelector("h3").textContent = domain.name;
    node.querySelector("p").textContent = domain.hostname;

    const recordsEl = node.querySelector(".records");

    for (const record of domain.dnsRecords) {
      const row = document.createElement("div");
      row.className = "record";
      row.innerHTML = `
        <div class="record-type"></div>
        <div>
          <code></code>
          <small></small>
        </div>
      `;

      row.querySelector(".record-type").textContent = record.type;
      row.querySelector("code").textContent = `${record.host} -> ${record.value}`;
      row.querySelector("small").textContent = record.purpose;
      recordsEl.append(row);
    }

    domainListEl.append(node);
  }
}

async function loadDomains() {
  try {
    const health = await api("/health");
    statusEl.textContent = health.ok ? "API online" : "API degraded";
    statusEl.className = "status-chip ok";

    const data = await api("/api/domains");
    renderDomains(data.domains);
  } catch (error) {
    statusEl.textContent = "API offline";
    statusEl.className = "status-chip error";
    renderDomains([]);
  }
}

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(formEl);
  const name = formData.get("name");
  const hostname = formData.get("hostname");

  await api("/api/domains", {
    method: "POST",
    body: JSON.stringify({ name, hostname: hostname || undefined }),
  });

  formEl.reset();
  await loadDomains();
});

loadDomains();
