import { EncryptCreateOrder, EncryptPayOrder } from './ArcaPgEncryption';
import { createOrder_call, payOrder_call, verifyOrder_call } from './Api';

export function CreateOrderEncrypt(params: any) {
  return EncryptCreateOrder(params);
}

export function PayOrderEncrypt(params: any) {
  return EncryptPayOrder(params);
}
export function CreateOrderApiRequest(data: string, pub_key: string) {
  return createOrder_call(data, pub_key);
}

export function PayOrderApiRequest(data: string, pub_key: string) {
  return payOrder_call(data, pub_key);
}

export function CreateOrder(params: any) {
  return createOrder_call(EncryptCreateOrder(params), params.pub_key);
}

export function PayOrder(params: any) {
  return payOrder_call(EncryptPayOrder(params), params.pub_key);
}

export function VerifyOrder(params: any) {
  return verifyOrder_call(params);
}
