const messageEls = document.querySelectorAll(".message");
const readerMetaEl = document.querySelector("#reader-meta");
const readerSubjectEl = document.querySelector("#reader-subject");
const readerKickerEl = document.querySelector("#reader-kicker");
const readerHeadlineEl = document.querySelector("#reader-headline");
const readerBodyEl = document.querySelector("#reader-body");

function selectMessage(messageEl) {
  for (const item of messageEls) {
    item.classList.remove("active");
  }

  messageEl.classList.add("active");

  const sender = messageEl.dataset.sender;
  const time = messageEl.dataset.time;
  const subject = messageEl.dataset.subject;
  const kicker = messageEl.dataset.kicker;
  const body = messageEl.dataset.body;

  readerMetaEl.textContent = `${sender} · ${time}`;
  readerSubjectEl.textContent = subject;
  readerKickerEl.textContent = kicker;
  readerHeadlineEl.textContent = subject;
  readerBodyEl.textContent = body;
}

for (const messageEl of messageEls) {
  messageEl.addEventListener("click", () => selectMessage(messageEl));
}

