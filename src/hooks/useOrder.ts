import { sumOrders } from "../helpers/sum";
import { totalProducts } from "../helpers/totalProducts";
import { setupOrderCounter, setupOrder } from "../setups";
import type { Order } from "..";

export default () => {
  let memoOrders: Order[] = [];
  const setMemoOrders = (orders: Order[]) => {
    memoOrders = orders;
    localStorage["memo-orders"] = JSON.stringify(memoOrders);

    document.querySelector("#orders")!.innerHTML = memoOrders
      .map(order => setupOrder(order))
      .join("");

    data().forEach(order => {
      const identifier = order.id;
      setupOrderCounter(identifier);
    });
  };

  let totalOrders = 0;
  const setTotalOrders = () => {
    totalOrders = totalProducts(memoOrders);
    document.querySelector("#total-products")!.innerHTML = String(totalOrders);
    localStorage["total-orders"] = JSON.stringify(JSON.stringify(totalOrders));
  };
  const setTotalPrice = (multiplier?: number) => {
    const totalPrice = (sumOrders(data()) * (multiplier || 1)).toFixed(2);
    document.querySelector("#total-price")!.innerHTML = "$" + totalPrice;
    localStorage["total-price"] = JSON.stringify(totalPrice);
  };

  const init = () => {
    const storageOrders = data();

    if (storageOrders && storageOrders.length > 0) {
      totalOrders = totalProducts(storageOrders);
      setMemoOrders(storageOrders);
      setTotalPrice();
      setTotalOrders();
    }
  };

  const add = (order: Order) => {
    const existingOrder = data().find(
      memoOrder => memoOrder.order.id === order.order.id
    ) as Order;

    if (existingOrder) {
      update({ ...existingOrder, quantity: ++existingOrder.quantity });
    } else {
      memoOrders = [...memoOrders, order];
    }

    setMemoOrders(memoOrders);
    setTotalPrice();
    setTotalOrders();
  };

  const update = (newOrder: Order) => {
    memoOrders = data().map(order => {
      if (order.id === newOrder.id) return newOrder;
      return order;
    });

    setMemoOrders(memoOrders);
    setTotalPrice();
    setTotalOrders();
  };

  const remove = (orderId: Order["id"]) => {
    memoOrders = memoOrders.filter(order => order.id !== orderId);

    setMemoOrders(memoOrders);
    setTotalPrice();
    setTotalOrders();
  };

  const clean = () => {
    memoOrders = []
    setMemoOrders([]);
    setTotalPrice(0);
    setTotalOrders();
  }

  const data = (): Order[] | never[] => {
    const localOrders = JSON.parse(localStorage.getItem("memo-orders") ?? "[]");
    memoOrders = localOrders

    return localOrders
  };

  return { add, remove, update, data, clean, init };
};
