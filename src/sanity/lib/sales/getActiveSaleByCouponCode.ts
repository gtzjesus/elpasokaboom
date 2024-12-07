import { defineQuery } from 'next-sanity';
import { CouponCode } from './couponCodes';
import { sanityFetch } from '../live';

export const getActiveByCouponCode = async (couponCode: CouponCode) => {
  const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
    *[
        _type == 'sale'
        && isActive == true 
        && couponCode == $couponCode
    ] | order(validFfrom desc)[0]
    `);

  try {
    const activeSale = await sanityFetch({
      query: ACTIVE_SALE_BY_COUPON_QUERY,
      params: {
        couponCode,
      }, // Pass coupon code as query parameter
    });

    return activeSale ? activeSale.data : null;
  } catch (err) {
    console.error('Error fetching active sale by coupon code:', err);
  }
};
