import type { Order } from "..";

export const totalProducts = (orders: Order[]) => {
	let accumulation = 0;

	for (const order of orders) {
		accumulation += order.quantity
	}

	return accumulation
}