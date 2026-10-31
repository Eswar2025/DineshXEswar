import { parsePaise, formatMoney as money, previewEqual } from "./money.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const state = {
  user: null,
  csrf: null,
  groups: [],
  groupId: null,
  data: null,
  registering: false,
  loadId: 0,
};

// Every interpolated user value is escaped. No server error or user name is inserted as HTML.
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
const today = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
const memberName = (id) =>
  state.data?.members.find((m) => m.id === id)?.name || "Member";
const isOwner = () => state.data?.group.ownerId === state.user?.id;
const canEdit = (expense) => isOwner() || expense.creatorId === state.user.id;
const canRecord = (senderId) => isOwner() || senderId === state.user.id;
const dateLabel = (date) =>
  new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function notice(message = "", error = false) {
  $("#notice").textContent = message;
  $("#notice").classList.toggle("error", error);
  $("#notice").hidden = !message;
}

function formError(form, message = "") {
  const element = form.querySelector(".form-error");
  element.textContent = message;
  element.hidden = !message;
}

async function api(path, { method = "GET", body } = {}) {
  const headers = {};
  if (method !== "GET") headers["Content-Type"] = "application/json";
  if (state.csrf) headers["X-CSRF-Token"] = state.csrf;
  let response;
  try {
    response = await fetch("/api" + path, {
      method,
      headers,
      credentials: "same-origin",
      ...(method !== "GET" ? { body: JSON.stringify(body ?? {}) } : {}),
    });
  } catch {
    throw Error(
      "Could not reach Split. Check your connection and try again; your input is still here.",
    );
  }
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(
      data?.error || "The request could not be completed.",
    );
    error.status = response.status;
    if (response.status === 401 && state.user) signOutLocally();
    throw error;
  }
  return data;
}

// Disable the current form while submitting. The user's values are retained on every failure.
async function submit(form, work) {
  if (form.dataset.busy === "true") return;
  formError(form);
  form.dataset.busy = "true";
  const controls = [...form.querySelectorAll("input, select, button")].map(
    (element) => [element, element.disabled],
  );
  controls.forEach(([element]) => {
    element.disabled = true;
  });
  try {
    await work();
  } catch (error) {
    formError(form, error.message);
    if (form.id === "expense-form" && error.status === 409)
      $("#reload-expense").hidden = false;
  } finally {
    controls.forEach(([element, disabled]) => {
      element.disabled = disabled;
    });
    form.dataset.busy = "false";
  }
}

function renderAccount() {
  $("#auth-screen").hidden = !!state.user;
  $("#workspace").hidden = !state.user;
  $("#account").hidden = !state.user;
  $("#guest-caption").hidden = !!state.user;
  $("#account-name").textContent = state.user?.name || "";
}

function signOutLocally() {
  state.user = null;
  state.csrf = null;
  state.groups = [];
  state.data = null;
  state.groupId = null;
  state.loadId++;
  $$("dialog[open]").forEach((dialog) => dialog.close());
  $("#auth-password").value = "";
  location.hash = "";
  renderAccount();
}

function renderGroups() {
  $("#group-count").textContent = state.groups.length;
  $("#group-list").innerHTML = state.groups.length
    ? state.groups
        .map(
          (group) => `
    <a class="group-link ${group.id === state.groupId ? "active" : ""}" href="#group/${escape(group.id)}" ${group.id === state.groupId ? 'aria-current="page"' : ""}>
      <span class="group-symbol" aria-hidden="true">${escape(initials(group.name))}</span>
      <span><strong>${escape(group.name)}</strong><small>${group.memberCount} ${group.memberCount === 1 ? "person" : "people"}</small></span>
    </a>`,
        )
        .join("")
    : '<p class="small muted">Your first circle starts here.</p>';
}

async function loadGroups() {
  const { groups } = await api("/groups");
  state.groups = groups;
  renderGroups();
  return groups;
}

async function selectGroup(id) {
  if (!state.user) return;
  const loadId = ++state.loadId;
  state.groupId = id;
  state.data = null;
  renderGroups();
  $("#group-view").hidden = true;
  $("#no-group").hidden = !!id;
  $("#group-loading").hidden = !id;
  if (!id) return;
  location.hash = "group/" + id;
  $$("dialog[open]").forEach((dialog) => dialog.close());
  try {
    const data = await api("/groups/" + encodeURIComponent(id));
    // A slow response from a previously selected group must not replace the current screen.
    if (loadId !== state.loadId) return;
    state.data = data;
    renderGroup();
  } catch (error) {
    if (loadId === state.loadId) notice(error.message, true);
  } finally {
    if (loadId === state.loadId) $("#group-loading").hidden = true;
  }
}

function acceptSnapshot(data) {
  if (data.group.id === state.groupId) {
    state.data = data;
    renderGroup();
  }
}

function renderGroup() {
  const data = state.data;
  if (!data) return;
  $("#group-view").hidden = false;
  $("#no-group").hidden = true;
  $("#group-title").textContent = data.group.name;
  $("#group-subtitle").textContent =
    `${data.members.length} ${data.members.length === 1 ? "person" : "people"} · ${isOwner() ? "You manage this group" : "A shared space for your people"}`;
  $("#total-spent").textContent = money(data.totalSpent);
  const ownBalance = data.members.find((m) => m.id === state.user.id).balance;
  $("#your-balance-label").textContent =
    ownBalance > 0
      ? "You should receive"
      : ownBalance < 0
        ? "You still owe"
        : "Your balance";
  $("#your-balance").textContent = money(Math.abs(ownBalance));
  $("#your-balance-hint").textContent =
    ownBalance === 0 ? "All square for now" : "After expenses and repayments";
  $("#expense-count").textContent = data.expenses.length;
  $("#balance-list").innerHTML = data.members
    .map(
      (m) => `
    <div class="balance-row"><span class="avatar" aria-hidden="true">${escape(initials(m.name))}</span><span class="balance-name">${escape(m.name)}${m.id === state.user.id ? " (you)" : ""}<small>${m.balance > 0 ? "Should receive" : m.balance < 0 ? "Owes" : "Settled"}</small></span><span class="balance-value">${money(m.balance, true)}</span></div>`,
    )
    .join("");
  $("#member-count").textContent = data.members.length;
  $("#member-list").innerHTML = data.members
    .map(
      (m) => `
    <div class="member-row"><span class="avatar" aria-hidden="true">${escape(initials(m.name))}</span><div class="member-info"><strong>${escape(m.name)}</strong><small>${escape(m.email)}</small></div>${m.id === data.group.ownerId ? '<span class="pill">Owner</span>' : ""}</div>`,
    )
    .join("");
  $("#member-form").hidden = !isOwner();
  $("#suggestion-list").innerHTML = data.suggestions.length
    ? data.suggestions
        .map(
          (s, i) => `
    <div class="suggestion"><p>${escape(memberName(s.senderId))} <span aria-hidden="true">→</span><span class="sr-only"> pays </span> ${escape(memberName(s.receiverId))}<strong>${money(s.amount)}</strong></p>${canRecord(s.senderId) ? `<button class="button subtle" type="button" data-suggestion="${i}">Record payment</button>` : '<p class="small muted">The sender or group owner can record this.</p>'}</div>`,
        )
        .join("")
    : '<div class="empty-state"><strong>All square.</strong><p>No repayments needed right now.</p></div>';
  $("#settlement-list").innerHTML = data.settlements.length
    ? data.settlements
        .map(
          (s) => `
    <div class="settlement-row"><div>${escape(memberName(s.senderId))} → ${escape(memberName(s.receiverId))}<small>${escape(dateLabel(s.date))} · recorded by ${escape(memberName(s.recorderId))}</small></div><strong>${money(s.amount)}</strong></div>`,
        )
        .join("")
    : '<div class="empty-state"><p>Repayments will appear here when they are recorded.</p></div>';
  renderExpenses();
}

function renderExpenses() {
  if (!state.data) return;
  const query = $("#expense-search").value.trim().toLowerCase();
  const expenses = state.data.expenses.filter((e) =>
    (e.description + " " + memberName(e.payerId)).toLowerCase().includes(query),
  );
  $("#expense-list").innerHTML = expenses.length
    ? expenses
        .map(
          (e) => `
    <article class="expense-row"><div class="expense-top"><div class="expense-title"><span class="icon-tile" aria-hidden="true">↗</span><div><h3>${escape(e.description)}</h3><p>${escape(memberName(e.payerId))} paid · ${escape(dateLabel(e.date))}</p></div></div><strong class="expense-amount">${money(e.amount)}</strong></div>
    <div class="expense-bottom"><span>${e.splitMode === "equal" ? "Equal split" : "Custom amounts"} · ${e.shares.length} ${e.shares.length === 1 ? "person" : "people"} · v${e.version}</span>${canEdit(e) ? `<div class="row-actions"><button class="text-button" type="button" data-edit="${escape(e.id)}">Edit<span class="sr-only"> ${escape(e.description)}</span></button><button class="text-button" type="button" data-delete="${escape(e.id)}">Delete<span class="sr-only"> ${escape(e.description)}</span></button></div>` : ""}</div>
    </article>`,
        )
        .join("")
    : `<div class="empty-state"><strong>${query ? "No matching expenses." : "The first story is yours."}</strong><p>${query ? "Try a different description or payer." : "Add something you shared to get started."}</p></div>`;
}

function chooseAuthMode(registering) {
  state.registering = registering;
  $("#name-field").hidden = !registering;
  $("#auth-name").required = registering;
  $("#auth-password").autocomplete = registering
    ? "new-password"
    : "current-password";
  $("#auth-form-title").textContent = registering
    ? "Make room for your people."
    : "Welcome back.";
  $("#auth-description").textContent = registering
    ? "Start with your name, email, and a password."
    : "Your groups and shared moments are waiting.";
  $("#auth-submit").textContent = registering
    ? "Create account ↗"
    : "Sign in ↗";
  $("#login-tab").classList.toggle("selected", !registering);
  $("#register-tab").classList.toggle("selected", registering);
  $("#login-tab").setAttribute("aria-pressed", String(!registering));
  $("#register-tab").setAttribute("aria-pressed", String(registering));
  formError($("#auth-form"));
}

$("#login-tab").addEventListener("click", () => chooseAuthMode(false));
$("#register-tab").addEventListener("click", () => chooseAuthMode(true));
$("#auth-form").addEventListener("submit", (event) => {
  event.preventDefault();
  // Capture input before disabling controls; a failed submission leaves it available to correct.
  const body = {
    name: $("#auth-name").value,
    email: $("#auth-email").value,
    password: $("#auth-password").value,
  };
  void submit(event.currentTarget, async () => {
    const result = await api(
      state.registering ? "/auth/register" : "/auth/login",
      { method: "POST", body },
    );
    state.user = result.user;
    state.csrf = result.csrf;
    $("#auth-password").value = "";
    notice();
    renderAccount();
    const groups = await loadGroups();
    const requested = location.hash.startsWith("#group/")
      ? location.hash.slice(7)
      : null;
    await selectGroup(
      groups.find((g) => g.id === requested)?.id || groups[0]?.id || null,
    );
  });
});
$("#logout").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await api("/auth/logout", { method: "POST" });
    signOutLocally();
    notice();
  } catch (error) {
    notice(error.message, true);
  } finally {
    button.disabled = false;
  }
});
$("#group-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#group-name").value;
  void submit(event.currentTarget, async () => {
    const data = await api("/groups", { method: "POST", body: { name } });
    $("#group-name").value = "";
    await loadGroups();
    await selectGroup(data.group.id);
    notice("Your group is ready. Add your people when they have registered.");
  });
});
$("#focus-new-group").addEventListener("click", () => $("#group-name").focus());
$("#member-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#member-email").value;
  const groupId = state.groupId;
  void submit(event.currentTarget, async () => {
    const data = await api(`/groups/${groupId}/members`, {
      method: "POST",
      body: { email },
    });
    $("#member-email").value = "";
    acceptSnapshot(data);
    await loadGroups();
    notice(
      "Your friend is part of the group. Earlier expense shares stay the same.",
    );
  });
});
window.addEventListener("hashchange", () => {
  const id = location.hash.startsWith("#group/")
    ? location.hash.slice(7)
    : null;
  if (state.user && id !== state.groupId) void selectGroup(id);
});
$("#refresh-group").addEventListener("click", () => {
  notice();
  void selectGroup(state.groupId);
});
$("#expense-search").addEventListener("input", renderExpenses);

function openExpense(expense = null) {
  if (!state.data) return;
  const form = $("#expense-form");
  form.reset();
  formError(form);
  form.dataset.expenseId = expense?.id || "";
  form.dataset.version = expense?.version || "";
  form.dataset.groupId = state.groupId;
  $("#reload-expense").hidden = true;
  $("#expense-dialog-title").textContent = expense
    ? "Edit expense"
    : "Add expense";
  $("#expense-description").value = expense?.description || "";
  $("#expense-amount").value = expense ? (expense.amount / 100).toFixed(2) : "";
  $("#expense-date").value = expense?.date || today();
  $("#expense-mode").value = expense?.splitMode || "equal";
  $("#expense-payer").innerHTML = state.data.members
    .map((m) => `<option value="${escape(m.id)}">${escape(m.name)}</option>`)
    .join("");
  $("#expense-payer").value = expense?.payerId || state.user.id;
  $("#participant-list").innerHTML = state.data.members
    .map((m) => {
      const share = expense?.shares.find((s) => s.userId === m.id);
      const selected = expense ? !!share : true;
      return `<div class="participant"><label><input type="checkbox" data-participant="${escape(m.id)}" ${selected ? "checked" : ""}>${escape(m.name)}</label><input class="custom-share" data-share="${escape(m.id)}" aria-label="${escape(m.name)} share in rupees" inputmode="decimal" placeholder="0.00" value="${share ? (share.amount / 100).toFixed(2) : ""}"></div>`;
    })
    .join("");
  updatePreview();
  if (!$("#expense-dialog").open) $("#expense-dialog").showModal();
  $("#expense-description").focus();
}

function selectedParticipants() {
  const custom = $("#expense-mode").value === "custom";
  return $$("#participant-list [data-participant]:checked").map((input) => ({
    userId: input.dataset.participant,
    ...(custom
      ? {
          amount: parsePaise(
            $$("#participant-list [data-share]").find(
              (s) => s.dataset.share === input.dataset.participant,
            ).value,
          ),
        }
      : {}),
  }));
}

function updatePreview() {
  const custom = $("#expense-mode").value === "custom";
  $$("#participant-list [data-share]").forEach((input) => {
    input.hidden = !custom;
    input.disabled =
      !custom ||
      !$$("#participant-list [data-participant]").find(
        (c) => c.dataset.participant === input.dataset.share,
      ).checked;
  });
  const amount = parsePaise($("#expense-amount").value);
  const participants = selectedParticipants();
  const summary = $("#share-summary");
  $("#share-preview-list").replaceChildren();
  if (!amount || !participants.length) {
    summary.textContent =
      "Enter an amount and select people to preview their shares.";
    return;
  }
  if (custom && participants.some((p) => p.amount === null)) {
    summary.textContent =
      "Enter a valid amount for each selected person. Zero shares are allowed.";
    return;
  }
  const shares = custom
    ? participants
    : previewEqual(
        amount,
        participants.map((p) => p.userId),
      );
  const sum = shares.reduce((total, p) => total + p.amount, 0);
  summary.textContent =
    sum === amount
      ? custom
        ? "Every paisa is assigned."
        : "Equal shares; any extra paise follow stable member ID order."
      : sum < amount
        ? money(amount - sum) + " still needs to be assigned."
        : money(sum - amount) + " over the expense total.";
  $("#share-preview-list").innerHTML = shares
    .map(
      (s) =>
        `<div class="preview-row"><span>${escape(memberName(s.userId))}</span><span>${money(s.amount)}</span></div>`,
    )
    .join("");
}

$("#add-expense").addEventListener("click", () => openExpense());
$("#expense-form").addEventListener("input", updatePreview);
$("#expense-form").addEventListener("change", updatePreview);
$("#expense-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const amount = parsePaise($("#expense-amount").value),
    participants = selectedParticipants();
  if (!amount) {
    formError(
      form,
      "Enter an amount from ₹0.01 to ₹10,00,000 with up to two decimal places.",
    );
    return;
  }
  if (!participants.length || participants.some((p) => p.amount === null)) {
    formError(form, "Select participants and enter valid custom shares.");
    return;
  }
  if (
    $("#expense-mode").value === "custom" &&
    participants.reduce((sum, p) => sum + p.amount, 0) !== amount
  ) {
    formError(form, "Custom shares must add up exactly to the expense total.");
    return;
  }
  const body = {
    description: $("#expense-description").value,
    amount,
    date: $("#expense-date").value,
    payerId: $("#expense-payer").value,
    splitMode: $("#expense-mode").value,
    participants,
  };
  const id = form.dataset.expenseId,
    groupId = form.dataset.groupId;
  if (id) body.version = Number(form.dataset.version);
  void submit(form, async () => {
    const data = await api(`/groups/${groupId}/expenses${id ? "/" + id : ""}`, {
      method: id ? "PATCH" : "POST",
      body,
    });
    acceptSnapshot(data);
    $("#expense-dialog").close();
    notice(
      id
        ? "Expense updated. Balances now reflect the new version."
        : "Expense saved. Everyone’s share is accounted for.",
    );
  });
});
$("#reload-expense").addEventListener("click", async () => {
  const form = $("#expense-form"),
    id = form.dataset.expenseId;
  try {
    const data = await api("/groups/" + form.dataset.groupId);
    acceptSnapshot(data);
    const latest = data.expenses.find((e) => e.id === id);
    if (!latest) {
      formError(
        form,
        "This expense was deleted. Close this form and refresh the group.",
      );
      return;
    }
    openExpense(latest);
  } catch (error) {
    formError(form, error.message);
  }
});
$("#expense-list").addEventListener("click", async (event) => {
  const edit = event.target.closest("[data-edit]"),
    remove = event.target.closest("[data-delete]");
  const id = edit?.dataset.edit || remove?.dataset.delete;
  const expense = state.data?.expenses.find((e) => e.id === id);
  if (!expense) return;
  if (edit) {
    openExpense(expense);
    return;
  }
  if (
    !confirm(
      `Delete “${expense.description}”? Its shares will be removed. Recorded repayments stay in the history.`,
    )
  )
    return;
  remove.disabled = true;
  try {
    const data = await api(`/groups/${state.groupId}/expenses/${id}`, {
      method: "DELETE",
      body: { version: expense.version },
    });
    acceptSnapshot(data);
    notice("Expense deleted. Repayment history has been preserved.");
  } catch (error) {
    notice(error.message, true);
    remove.disabled = false;
  }
});

function settlementLimit() {
  const sender = state.data.members.find(
    (m) => m.id === $("#settlement-sender").value,
  );
  const receiver = state.data.members.find(
    (m) => m.id === $("#settlement-receiver").value,
  );
  return Math.max(
    0,
    Math.min(-(sender?.balance || 0), receiver?.balance || 0, 100_000_000),
  );
}

function updateSettlementReceivers(preferred) {
  const old = preferred || $("#settlement-receiver").value;
  const members = state.data.members.filter(
    (m) => m.id !== $("#settlement-sender").value,
  );
  $("#settlement-receiver").innerHTML = members
    .map((m) => `<option value="${escape(m.id)}">${escape(m.name)}</option>`)
    .join("");
  $("#settlement-receiver").value = members.some((m) => m.id === old)
    ? old
    : members.find((m) => m.balance > 0)?.id || members[0]?.id || "";
  updateSettlementCap();
}

function updateSettlementCap() {
  const limit = settlementLimit();
  $("#settlement-cap").textContent = limit
    ? `Current maximum: ${money(limit)}. Balances are checked again when saving.`
    : "This pair has no outstanding debtor-to-creditor repayment. Choose someone who owes and someone who should receive.";
}

function openSettlement(suggestion = null) {
  if (!state.data) return;
  const form = $("#settlement-form");
  form.reset();
  formError(form);
  form.dataset.groupId = state.groupId;
  const senders = state.data.members.filter((m) => canRecord(m.id));
  $("#settlement-sender").innerHTML = senders
    .map((m) => `<option value="${escape(m.id)}">${escape(m.name)}</option>`)
    .join("");
  $("#settlement-sender").value =
    suggestion?.senderId ||
    senders.find((m) => m.balance < 0)?.id ||
    state.user.id;
  updateSettlementReceivers(suggestion?.receiverId);
  const limit = settlementLimit();
  $("#settlement-amount").value = limit
    ? (Math.min(suggestion?.amount ?? limit, limit) / 100).toFixed(2)
    : "";
  $("#settlement-date").value = today();
  $("#settlement-dialog").showModal();
}

$("#record-settlement").addEventListener("click", () => openSettlement());
$("#suggestion-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-suggestion]");
  if (button)
    openSettlement(state.data.suggestions[Number(button.dataset.suggestion)]);
});
$("#settlement-sender").addEventListener("change", () =>
  updateSettlementReceivers(),
);
$("#settlement-receiver").addEventListener("change", updateSettlementCap);
$("#settlement-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const amount = parsePaise($("#settlement-amount").value);
  if (!amount || amount > settlementLimit()) {
    formError(
      form,
      "Enter a positive repayment no larger than the current maximum.",
    );
    return;
  }
  const body = {
    senderId: $("#settlement-sender").value,
    receiverId: $("#settlement-receiver").value,
    amount,
    date: $("#settlement-date").value,
  };
  const groupId = form.dataset.groupId;
  void submit(form, async () => {
    const data = await api(`/groups/${groupId}/settlements`, {
      method: "POST",
      body,
    });
    acceptSnapshot(data);
    $("#settlement-dialog").close();
    notice("Repayment recorded. You’re a little more settled.");
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-close]");
  if (button) document.getElementById(button.dataset.close).close();
});
$$("dialog").forEach((dialog) =>
  dialog.addEventListener("cancel", (event) => {
    if (dialog.querySelector("form").dataset.busy === "true")
      event.preventDefault();
  }),
);

// Restore a verified server session on refresh; credentials never enter localStorage.
async function boot() {
  try {
    const result = await api("/auth/me");
    state.user = result.user;
    state.csrf = result.csrf;
    renderAccount();
    const groups = await loadGroups();
    const requested = location.hash.startsWith("#group/")
      ? location.hash.slice(7)
      : null;
    await selectGroup(
      groups.find((g) => g.id === requested)?.id || groups[0]?.id || null,
    );
  } catch (error) {
    renderAccount();
    if (error.status !== 401) notice(error.message, true);
  }
}
void boot();
