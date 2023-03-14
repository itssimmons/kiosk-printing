import { setupCatalogCard, setupTicket, ticketStyles } from "./setups";
import catalog from "./assets/menu.json";
import useOrder from "./hooks/useOrder";
import "./style.css";
import printJS from "print-js";

const { add, data, init: initOrders } = useOrder();

document.addEventListener("DOMContentLoaded", () => {
  init();
  initOrders();

  document.querySelectorAll<HTMLDivElement>("div.card").forEach((element) => {
    element.addEventListener("click", (e) => {
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

  document.querySelector('#done')!.addEventListener('click', (e) => {
    e.preventDefault()

    const price = JSON.parse(localStorage.getItem('total-price') as string);
    const total = JSON.parse(localStorage.getItem('total-orders') as string);

    const ticket = setupTicket(data(), { price, total, title: 'AWESOME TITLE', subtitle: 'LOREM IPSUM DOLOR SIT AMET' })

    printJS({
      printable: ticket,
      type: 'html',
      header: '',
      documentTitle: '',
      style: ticketStyles,
      showModal: false,
    })
  })
});

const init = () => {
  document.querySelector<HTMLDivElement>("#yourorder")!.innerHTML = `
		<header class="top">
			<div>
				<h3>Your order</h3>
				<b id="total-products">0</b>
			</div>
			<p>Take out</p>
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
			${catalog.map((c) => setupCatalogCard(c)).join("")}
		</section>
	`;
};
