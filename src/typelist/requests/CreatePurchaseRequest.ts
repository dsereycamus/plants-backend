import {
  PurchaseDeliveryData,
  PurchaseBuyerData,
} from "../schemas";

export enum EPaymentMethods {
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
}

type TProductData = {
  id: string;
  amount: number;
};

export type TCreatePurchaseRequest = {
  products: TProductData[];
  intendedTotalPrice: number;
  paymentMethod: EPaymentMethods;
  deliveryData: PurchaseDeliveryData;
  buyerData?: PurchaseBuyerData;
};
