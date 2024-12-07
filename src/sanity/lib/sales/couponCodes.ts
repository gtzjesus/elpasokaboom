export const COUPON_CODES = {
  BFRIYAY: 'BFRIYAY',
} as const;

export type CouponCode = keyof typeof COUPON_CODES;
