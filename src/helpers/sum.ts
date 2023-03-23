import type { Order } from "..";

export const sumOrders = (orders: Order[]) => {
	let accumulation = 0;

	for (const order of orders) {
		accumulation += order.order.price * order.quantity
	}

	return accumulation
}