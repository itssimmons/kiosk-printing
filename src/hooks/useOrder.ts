import { sumOrders } from "../helpers/sum";
import type { Order } from "..";
import { setupOrder } from "../setups";
import { totalProducts } from "../helpers/totalProducts";

export default () => {
  let memoOrders: Order[] = [];
  const setMemoOrders = (orders: Order[]) => {
    memoOrders = orders;
    localStorage['memo-orders'] = JSON.stringify(memoOrders)

    document.querySelector("#orders")!.innerHTML = memoOrders
      .map((order) => setupOrder(order))
      .join("");
  };

  let totalOrders = 0;
  const setTotalOrders = () => {
    totalOrders = totalProducts(memoOrders);
    document.querySelector("#total-products")!.innerHTML = String(totalOrders);
    localStorage['total-orders'] = JSON.stringify(JSON.stringify(totalOrders))
  };
  const setTotalPrice = (multiplier?: number) => {
    const totalPrice = (sumOrders(memoOrders) * (multiplier || 1)).toFixed(2) 
    document.querySelector("#total-price")!.innerHTML = "$" + totalPrice;
    localStorage['total-price'] = JSON.stringify(totalPrice)
  };

  const init = () => {
    const storageOrders = data()

    if (storageOrders && storageOrders.length > 0) {
      totalOrders = totalProducts(storageOrders);
      setMemoOrders(storageOrders);
      setTotalPrice(totalOrders);
      setTotalOrders();
    }
  }

  const add = (order: Order) => {
    const existingOrder = memoOrders.find(
      (memoOrder) => memoOrder.order.id === order.order.id
    ) as Order;

    if (existingOrder) {
      update(existingOrder);
    } else {
      memoOrders = [...memoOrders, order];
    }

    setMemoOrders(memoOrders);
    setTotalPrice(totalOrders);
    setTotalOrders();
  };

  const update = (newOrder: Order) => {
    memoOrders = memoOrders.map((order) => {
      if (order.id === newOrder.id)
        return { ...newOrder, quantity: ++newOrder.quantity };
      return order;
    });

    setMemoOrders(memoOrders);
    setTotalPrice(totalOrders);
    setTotalOrders();
  };

  const remove = (orderId: Order["id"]) => {
    memoOrders = memoOrders.filter((order) => order.id !== orderId);

    setMemoOrders(memoOrders);
    setTotalPrice(totalOrders);
    setTotalOrders();
  };

  const data = (): Order[] | never[] => {
    return JSON.parse(localStorage.getItem('memo-orders') ?? '[]')
  }

  return { add, remove, update, data, init };
};
