import useOrder from "./hooks/useOrder";
import type { Catalog, Order, Ticket } from ".";
import { findMenuById } from "./helpers/findMenuById";

export const setupCatalogCard = (props: Catalog) => {
  const divCard = document.createElement("div");
  divCard.className = "card";
  divCard.setAttribute("data-identify", String(props.id));

  divCard.innerHTML = `
	<img src="${props.preview}" alt="food preview" />
	<p>${props.name}</p>
	<b>$${props.price}</b>
	`;

  return divCard.outerHTML;
};

export const setupOrder = (props: Order) => {
  const divOrder = document.createElement("div");
  divOrder.className = "order";
  divOrder.setAttribute("data-identify", String(props.id));
  const menu = findMenuById(props.order.id)

  divOrder.innerHTML = `
	<img src="${props.order.preview}" alt="food order preview" />
	<p>${props.order.name}</p>
	<strong>$${Number(menu.price * props.quantity).toFixed(2)}</strong>
	<div>
		<button type="button" class="plus" id="d@${props.id}">-</button>
		<p id="q@${props.id}">${props.quantity}</p>
		<button type="button" class="minus" id="i@${props.id}">+</button>
	</div>
	`;

  return divOrder.outerHTML;
};

export const setupOrderCounter = (identifier: string) => {
  const { update, data } = useOrder();

  const incrementEl = document.getElementById(`i@${identifier}`) as HTMLButtonElement,
    decrementEl = document.getElementById(`d@${identifier}`) as HTMLButtonElement,
    destinationEl = document.getElementById(`q@${identifier}`) as HTMLElement;

  let counter = Number(destinationEl.textContent);

  const setCounter = (count: number) => {
    if (count < 1) return;
    counter = count;
    destinationEl.innerHTML = `${counter}`;

    const order = data().find(order => order.id === identifier)!;
    const menu = findMenuById(order.order.id)

    update({
      ...order,
      order: {
        ...order.order,
        price: counter * menu.price,
      },
      quantity: counter,
    });
  };

  incrementEl.onclick = () => setCounter(++counter);
  decrementEl.onclick = () => setCounter(--counter);
};

export const setupTicket = (
  orders: Order[],
  { total, price, title, subtitle }: Ticket
) => {
  const now = new Date();

  const date = `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`;
  const time = `${now.getHours()}:${now.getMinutes()}`;

  const ticketSect = document.createElement("section");
  ticketSect.id = "ticket";
  ticketSect.innerHTML = `
    <h6>${title}</h6>
    <header>
      <span>
        <p>${subtitle}</p>
      </span>
      <p id="date">FECHA: ${date}</p>
      <p id="time">HORA: ${time}</p>
    </header>
    <div id="content">
      <div id="products">
        ${orders
          .map(
            order => `<div class="product">
          <p>${order.order.name} (x${order.quantity})</p>
          <b>${(findMenuById(order.order.id).price * order.quantity).toFixed(2)}$</b>
        </div>`
          )
          .join("")}
      </div>
      <div id="total-sell">
        <p id="total-ticket-products">${total} ART.</p>
        <b id="total-ticket-price">TOTAL($) ${price}</b>
      </div>
    </div>
    <footer>
      <i>MUCHAS GRACIAS POR SU COMPRA!</i>
    </footer>
  `;

  return ticketSect;
};

export const ticketStyles = `
  #ticket{width:7.95cm;min-height:6.90cm;padding:12px;padding-bottom:40px;font-family:monospace;position:relative}#ticket h6{text-align:center;text-transform:uppercase;font-size:11pt;font-weight:800}#ticket header>span{background-color:black;white-space:nowrap;color:white;font-weight:800;font-size:10pt;width:100%;text-align:center;display:block;margin-bottom:10px;margin-top:4px}#ticket header>p{font-size:10pt;font-weight:600}#ticket #content #total-sell{width:100%;text-align:center;display:flex;align-items:center;justify-content:space-between;white-space:nowrap}#ticket #content #total-sell p{font-size:10pt;font-weight:600}#ticket #content #total-sell b{font-size:11pt}#ticket footer{position:absolute;text-align:center;bottom:8px;left:50%;transform:translateX(-50%);white-space:nowrap}#ticket footer i{font-size:10pt;font-weight:700}#ticket #content #products{display:flex;flex-direction:column;gap:6px}#ticket #content #products div{display:flex;align-items:center;justify-content:space-between}#ticket #content #products{margin-top:14px;margin-bottom:12px}#ticket #content #products .product p,b{font-weight:700;font-size:11pt;text-transform:uppercase}
`;
