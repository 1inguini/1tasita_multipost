[...document.forms].map((form) => {
  if (form.action === "https://shikorism.net/checkin") {
    form.addEventListener("submit", (event) => {
      const [year, month, day] = withId("date").value.split("/", 3);
      const [hour, minute] = withId("time")
        .value.split(":", 2)
        .map((str) => str.padStart(2, "0"));

      browser.runtime.sendMessage({
        year,
        month,
        day,
        hour,
        minute,
        body: {
          checked_in_at: `${year}-${month}-${day}T${hour}:${minute}:00+0900`,
          tags: withName("tags").checked,
          note: withName("note").checked,
          is_private: withName("is_private").checked,
          is_too_sensitive: withName("is_too_sensitive").checked,
          discard_elapsed_time: withName("discard_elapsed_time").checked,
        },
      });
    });
  }
});
