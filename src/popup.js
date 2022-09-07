import { coins } from "./coins.js";
import config from "./config.js";

let selected = undefined;

const htmlToElement = (html) => {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
};

const main = () => {
  const input = document.getElementById("searchinput");
  const ul = document.getElementById("resultul");

  let lastSearch = "";

  const updateSearch = () => {
    const text = input.value.toLowerCase();
    if (text === lastSearch) return;
    lastSearch = text;
    ul.innerHTML = "";
    coins
      .filter(
        (x) =>
          x.symbol.toLowerCase().startsWith(text) ||
          x.name.toLowerCase().startsWith(text)
      )
      .slice(0, 5)
      .forEach((coin) => {
        const icon = "thumb_base64" in coin ? coin.thumb_base64 : coin.thumb;
        const line = li
          .replace("*ICON*", icon)
          .replace("*COIN*", `${coin.name} (${coin.symbol})`)
          .replace("*LINK*", `${config.web}/${coin.id}`)
          .replace(
            "*RANK*",
            coin.market_cap_rank ? `#${coin.market_cap_rank}` : ""
          );

        const lielem = htmlToElement(line);
        lielem.addEventListener("mousemove", setSelected);
        ul.appendChild(lielem);
      });
    setSelected({ currentTarget: ul.firstChild });
  };

  input.addEventListener("keyup", updateSearch);
};

const setSelected = (event) => {
  const selectedItem = document.querySelector(".selected");
  selectedItem?.classList.remove("selected");
  selected = event.currentTarget;
  selected?.classList.add("selected");
};

const launchSelected = () => {
  console.log(selected);
  if (!selected) return;
  window.open(selected.querySelector("a").href, "_blank");
};

const destroy = () => {
  window.close();
};

const moveSelectionDown = () => {
  if (!selected) return;
  if (!selected.nextSibling) return;
  setSelected({ currentTarget: selected.nextSibling });
};

const moveSelectionUp = () => {
  if (!selected) return;
  if (!selected.previousSibling) return;
  setSelected({ currentTarget: selected.previousSibling });
};

window.onkeydown = function (event) {
  if (event.key === "Enter") {
    launchSelected();
    destroy();
  }
  if (event.key === "ArrowDown") {
    moveSelectionDown();
  }
  if (event.key === "ArrowUp") {
    moveSelectionUp();
  }
};

main();

const li = `
<li class="resultli">
    <a href="*LINK*" class="rowlink" target="_blank">
        <div class="rowdiv">
            <span class="imgspan">
                <img src="*ICON*" class="resultimg">
            </span>
            <span style="width:70vw;">*COIN*</span>
            <span class="rankspan" style="font-size: 12px;">*RANK*</span>
        </div>
    </a>
</li>`;
