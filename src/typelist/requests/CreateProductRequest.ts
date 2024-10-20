export type TCreateProductRequest = {
  name: string;
  price: number;
  description: string;
  image: string;
  owner: string; //Ref ID
};
