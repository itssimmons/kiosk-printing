import printJS from "print-js";
import entireCatalog from "./assets/menu.json";
import useOrder from "./hooks/useOrder";
import { setupCatalogCard, setupTicket, ticketStyles } from "./setups";
import "./style.css";

const { add, clean, data, init: initOrders } = useOrder();

document.addEventListener("DOMContentLoaded", () => {
  init();
  initOrders();

  document.querySelectorAll<HTMLDivElement>("div.card").forEach(element => {
    element.addEventListener("click", e => {
      const event = e.target as HTMLElement;
      const [img, p, b] = event.children as unknown as [
        HTMLImageElement,
        HTMLParagraphElement,
        HTMLParagraphElement
      ];

      const order = {
        id: event.dataset.identify as string,
        preview: img.src as string,
        name: p.textContent as string,
        price: parseFloat(b.textContent!.replace("$", "")),
      };

      add({
        id: `${Date.now()}`,
        quantity: 1,
        order,
      });
    });
  });

  document.querySelector("#clean")!.addEventListener("click", () => clean());

  document.querySelector("#done")!.addEventListener("click", e => {
    e.preventDefault();

    const price = JSON.parse(localStorage.getItem("total-price") as string);
    const total = JSON.parse(localStorage.getItem("total-orders") as string);

    const ticket = setupTicket(data(), {
      price,
      total,
      title: "AWESOME TITLE",
      subtitle: "LOREM IPSUM DOLOR SIT AMET",
    });

    printJS({
      printable: ticket,
      type: "html",
      header: "",
      documentTitle: "",
      style: ticketStyles,
      showModal: false,
    });
  });
});

const init = () => {
  document.querySelector<HTMLDivElement>("#yourorder")!.innerHTML = `
		<header class="top">
			<div>
				<h3>Your order</h3>
				<b id="total-products">0</b>
			</div>
      <div>
        <p>Take out</p>
        <svg id="clean" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 3.99998H17.9C17.4215 1.67358 15.3751 0.003 13 0H11C8.62484 0.003 6.57837 1.67358 6.09997 3.99998H2.99998C2.4477 3.99998 2 4.44769 2 4.99997C2 5.55225 2.4477 6 2.99998 6H3.99997V19C4.0033 21.76 6.23994 23.9967 8.99998 24H15C17.76 23.9967 19.9967 21.76 20 19V6H21C21.5523 6 22 5.5523 22 5.00002C22 4.44773 21.5523 3.99998 21 3.99998ZM11 17C11 17.5523 10.5523 18 10 18C9.44769 18 8.99998 17.5523 8.99998 17V11C8.99998 10.4477 9.44769 10 9.99997 10C10.5522 10 11 10.4477 11 11V17H11ZM15 17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10C14.5523 10 15 10.4477 15 11V17ZM8.171 3.99998C8.59634 2.80228 9.72903 2.00152 11 1.99997H13C14.271 2.00152 15.4037 2.80228 15.829 3.99998H8.171Z"
            fill="#fff"
          />
        </svg>
      </div>
		</header>
		<div id="orders"></div>
		<footer class="bottom">
			<h5>Total</h5>
			<strong id="total-price">$0</strong>
			<button type="button" id="done">Done</button>
		</footer>
	`;

  document.querySelector<HTMLDivElement>("#catalog")!.innerHTML = `
		<header id="logo">
			<img src="/assets/22444.png" alt="business logo" />
		</header>
		<h1><strong>Hey,</strong> what's up?</h1>
		<section class="cards">
			${entireCatalog.map(c => setupCatalogCard(c)).join("")}
		</section>
	`;
};
