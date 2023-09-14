browser.runtime.onMessage.addListener(
  async ({ year, month, day, hour, minute, is_private, link, note, tags }) => {
    // [Nuita](https://nuita.net)
    // get csrf-token
    // await (
    //   await fetch("https://nuita.net")
    // ).body
    //   .pipeThrough(new TextDecoderStream())
    //   .pipeThrough(
    //     new TextDecoderStream({
    //       outside: true,
    //       accm: "",
    //       transform(text, controller) {
    //         this.accm += text;

    //         if (this.head) {
    //         } else {
    //         }
    //         controller.enqueue(this.accm);
    //         this.accm = "";
    //       },
    //     })
    //   )
    //   .pipeTo(
    //     new WritableStream({
    //       state: "",
    //       write(text) {
    //         this.state += text;
    //         this.state.replace(/^.*<head>/, "<head>");
    //       },
    //     })
    //   );

    const authenticity_token = new DOMParser()
      .parseFromString(
        await (await fetch("https://nuita.net")).text(),
        "text/html"
      )
      .head.getElementsByTagName("meta")["csrf-token"].content;
    fetch("https://nuita.net/nweets", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        authenticity_token,
        "nweet[statement]":
          (link ? link + " " : "") +
          (note ? note + " " : "") +
          tags.map((tag) => "#" + tag).join(" "),
        "nweet[privacy]": is_private ? "private" : "public",
        "nweet[did_at]": `${year}-${month}-${day}T${hour}:${minute}:00+0900`,
        commit: "ヌイート",
      }).toString(),
    });
  }
);
