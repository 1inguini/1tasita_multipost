
document.addEventListener('DOMContentLoaded', () => {
  function spanJapanese(el) {
    if (!["SCRIPT", "STYLE", "SPAN"].includes(el.tagName)) {
      el.childNodes.forEach((child) => {
        if (child instanceof Text) {
          if (/[^\p{White_Space}]/u.test(child.data)) {
            child.data
              .split(
                /([\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]+)/u
              )
              .forEach((text) => {
                if (/[^\p{White_Space}]/u.test(text)) {
                  // console.log(text);
                  const span = document.createElement("span");
                  span.textContent = text;
                  child.before(span);
                }
              });
            el.removeChild(child);
          }
        } else {
          spanJapanese(child);
        }
      });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      spanJapanese(document)
    );
  } else {
    spanJapanese(document);
  }
  function unSpan(el) {
    if (
      el instanceof HTMLElement &&
      [...el.childNodes].every((child) => child instanceof HTMLSpanElement)
    ) {
      el.replaceChildren(el.textContent);
    } else {
      el.childNodes.forEach(unSpan);
    }
  }

  document.getElementById("post").addEventListener("submit", (event) => {
    const form = this;
    const tags = [...form.tags.children].map((li) => li.textContent);
    // [Tissue](https://shikorism.net)
    fetch("https://shikorism.net/api/v1/checkin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${form.tissueToken.value}`,
      },
      body: {
        checked_in_at: `${document.getElementById("date").value}T${document.getElementById("time").value
          }:00+0900`,
        tags,
        link: form.link.value,
        note: form.note.value,
        is_private: form.isPrivate.checked,
        is_too_sensitive: form.isTooSensitive.checked,
        discard_elapsed_time: form.discardElapsedTime.checked,
      },
    });

    // [Nuita](https://nuita.net)
    fetch("https://nuita.net/nweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        authenticity_token: form.nuitaToken.value,
        "nweet[statement]":
          form.link.value +
          "\n" +
          form.note.value +
          "\n" +
          tags.map((tag) => "#" + tag).join(" "),
        "nweet[privacy]": form.isPrivate.checked ? "private" : "public",
        "nweet[did_at]": `${document.getElementById("date").value}T${document.getElementById("time").value
          }:00+0900`,
        commit: "ヌイート",
      }).toString(),
    });
    event.stopPropagation();
    event.preventDefault();
  });

  function updateDate() {
    const now = new Date();
    document.getElementById("date").value = `${now.getFullYear()}-${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    document.getElementById("time").value = `${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateDate);
  } else {
    updateDate();
  }

  document.getElementById("isRealtime").addEventListener("change", () => {
    updateDate();
    document.getElementById("date").toggleAttribute("disabled");
    document.getElementById("time").toggleAttribute("disabled");
  });

  document.getElementById("tagInput").addEventListener("click", (event) => {
    console.log(event);
    if (event instanceof KeyboardEvent && event.key === "\t") {
      console.log("Tab");
    }
  });
});