export type Item = {
  id: number;
  brand: string;
  price: number;
  image: string;
};

let items: Item[] = [];

export function getItems() {
  return items;
}

export function addItem(item: Item) {
  items.push(item);
}
