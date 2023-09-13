import { withId } from "./util.mjs";

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
spanJapanese(document);

function unSpan(el) {
  if (
    el instanceof HTMLElement &&
    [...el.childNodes].every((child) => child instanceof HTMLSpanElement)
  ) {
    el.replaceChildren(el.textContent);
  } else {
    el.childNodes.forEach(unSpan);
  }
  a;
}

withId("submit").addEventListener("click", () => {
  const form = withId("post");
  if (!form.reportValidity()) {
    return;
  }
  const tags = [...form.tags.children].map((li) => li.textContent);
  // // [Tissue](https://shikorism.net)
  // fetch("https://shikorism.net/api/v1/checkins", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${form.tissueToken.value}`,
  //   },
  //   body: {
  //     checked_in_at: `${withId("date").value}T${withId("time").value}:00+0900`,
  //     tags,
  //     link: form.link.value,
  //     note: form.note.value,
  //     is_private: form.isPrivate.checked,
  //     is_too_sensitive: form.isTooSensitive.checked,
  //     discard_elapsed_time: form.discardElapsedTime.checked,
  //   },
  // });

  // // [Nuita](https://nuita.net)
  // // function () {
  // //   document.cookie = "age_checked=true; path=/; max-age=".concat(31536e4);
  // // }
  // // authenticity_token
  // // user[email]
  // // user[password]
  // // commit: "ログイン"
  // // user[remenber_me] ["0","1"]
  // fetch("https://nuita.net", {
  //   credentials: "include",
  // });
  // fetch("https://nuita.net/nweets", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  //   body: new URLSearchParams({
  //     authenticity_token:
  //       document.head.getElementsByTagName("meta")["csrf-token"].content,
  //     "nweet[statement]":
  //       (form.link.value ? form.link.value + " " : "") +
  //       (form.note.value ? form.note.value + " " : "") +
  //       tags.map((tag) => "#" + tag).join(" "),
  //     "nweet[privacy]": form.isPrivate.checked ? "private" : "public",
  //     "nweet[did_at]": `${withId("date").value}T${
  //       withId("time").value
  //     }:00+0900`,
  //     commit: "ヌイート",
  //   }).toString(),
  // });
});

function updateDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  withId("date").value = `${year}-${month}-${date}`;
  withId("time").value = `${hour}:${minute}`;
}
updateDate();

withId("isRealtime").addEventListener("change", function () {
  if (this.checked) updateDate();
  withId("date").toggleAttribute("disabled", this.checked);
  withId("time").toggleAttribute("disabled", this.checked);
});

function commitTag(tagString) {
  const tag = document.createElement("a");
  tag.append(tagString);
  tag.setAttribute(
    "href",
    "https://shikorism.net/search/checkin?" +
      new URLSearchParams({ q: tagString }).toString()
  );
  withId("tags").appendChild(tag);
}
withId("tagInput").addEventListener("input", function (event) {
  if (/\p{WSpace}/u.test(event.data)) {
    commitTag(this.value.trim());
    this.value = "";
  }
});
withId("tagInput").addEventListener("change", function () {
  commitTag(this.value.trim());
  this.value = "";
});
