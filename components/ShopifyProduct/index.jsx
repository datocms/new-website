import Button from 'components/Button';
import Wrapper from 'components/Wrapper';
import CartIcon from 'public/icons/regular/cart-plus.svg';
import { useEffect, useState } from 'react';
import s from './style.module.css';

const currencies = {
  USD: '$',
  EUR: '\u20ac',
  AED: '\u062f.\u0625',
  AFN: '\u060b',
  ALL: 'L',
  AMD: '\u058f',
  ANG: '\u0192',
  AOA: 'Kz',
  ARS: '$',
  AUD: '$',
  AWG: '\u0192',
  AZN: '\u20bc',
  BAM: 'KM',
  BBD: '$',
  BDT: '\u09f3',
  BGN: '\u043b\u0432.',
  BHD: '.\u062f.\u0628',
  BIF: 'Fr',
  BMD: '$',
  BND: '$',
  BOB: 'Bs.',
  BRL: 'R$',
  BSD: '$',
  BTN: 'Nu.',
  BWP: 'P',
  BYN: 'Br',
  BZD: '$',
  CAD: '$',
  CDF: 'Fr',
  CHF: 'Fr.',
  CLP: '$',
  CNY: '\u00a5',
  COP: '$',
  CRC: '\u20a1',
  CUP: '$',
  CVE: '$',
  CZK: 'K\u010d',
  DJF: 'Fr',
  DKK: 'kr',
  DOP: 'RD$',
  DZD: '\u062f.\u062c',
  EGP: '\u00a3',
  ERN: 'Nfk',
  ETB: 'Br',
  FJD: '$',
  FKP: '\u00a3',
  GBP: '\u00a3',
  GEL: '\u20be',
  GHS: '\u20b5',
  GIP: '\u00a3',
  GMD: 'D',
  GNF: 'Fr',
  GTQ: 'Q',
  GYD: '$',
  HKD: '$',
  HNL: 'L',
  HRK: 'kn',
  HTG: 'G',
  HUF: 'Ft',
  IDR: 'Rp',
  ILS: '\u20aa',
  INR: '\u20b9',
  IQD: '\u0639.\u062f',
  IRR: '\ufdfc',
  ISK: 'kr',
  JMD: '$',
  JOD: '\u062f.\u0627',
  JPY: '\u00a5',
  KES: 'Sh',
  KGS: '\u0441',
  KHR: '\u17db',
  KMF: 'Fr',
  KPW: '\u20a9',
  KRW: '\u20a9',
  KWD: '\u062f.\u0643',
  KYD: '$',
  KZT: '\u20b8',
  LAK: '\u20ad',
  LBP: '\u0644.\u0644',
  LKR: 'Rs',
  LRD: '$',
  LSL: 'L',
  LYD: '\u0644.\u062f',
  MAD: '\u062f.\u0645.',
  MDL: 'L',
  MGA: 'Ar',
  MKD: '\u0434\u0435\u043d',
  MMK: 'Ks',
  MNT: '\u20ae',
  MOP: 'MOP$',
  MRU: 'UM',
  MUR: '\u20a8',
  MVR: '.\u0783',
  MWK: 'MK',
  MXN: '$',
  MYR: 'RM',
  MZN: 'MT',
  NAD: '$',
  NGN: '\u20a6',
  NIO: 'C$',
  NOK: 'kr',
  NPR: '\u0930\u0942',
  NZD: '$',
  OMR: '\u0631.\u0639.',
  PAB: 'B/.',
  PEN: 'S/.',
  PGK: 'K',
  PHP: '\u20b1',
  PKR: '\u20a8',
  PLN: 'z\u0142',
  PYG: '\u20b2',
  QAR: '\u0631.\u0642',
  RON: 'lei',
  RSD: '\u0434\u0438\u043d.',
  RUB: '\u20bd',
  RWF: 'Fr',
  SAR: '\ufdfc',
  SBD: '$',
  SCR: '\u20a8',
  SDG: '\u062c.\u0633.',
  SEK: 'kr',
  SGD: '$',
  SHP: '\u00a3',
  SLL: 'Le',
  SOS: 'Sh',
  SRD: '$',
  SSP: '\u00a3',
  STN: 'Db',
  SYP: '\u00a3',
  SZL: 'L',
  THB: '\u0e3f',
  TJS: '\u0441.',
  TMT: 'm.',
  TND: '\u062f.\u062a',
  TOP: 'T$',
  TRY: '\u20ba',
  TTD: '$',
  TWD: '$',
  TZS: 'Sh',
  UAH: '\u20b4',
  UGX: 'Sh',
  UYU: '$',
  UZS: 'S\u02bb',
  VES: 'Bs.',
  VND: '\u20ab',
  VUV: 'Vt',
  WST: 'T',
  XAF: 'Fr',
  XCD: '$',
  XOF: 'Fr',
  XPF: '\u20a3',
  YER: '\ufdfc',
  ZAR: 'R',
  ZMW: 'ZK',
  ZWL: '$',
};

export default function ShopifyProduct({ block }) {
  const [shopifyProduct, setShopifyProduct] = useState(null);
  const [variantId, setVariantId] = useState(null);

  useEffect(() => {
    async function run() {
      const response = await fetch(
        'https://graphql.myshopify.com/api/graphql',
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token':
              '078bc5caa0ddebfa89cccb4a1baa1f5c',
          },
          method: 'POST',
          body: JSON.stringify({
            query:
              /* GraphQL */
              `
                query getProduct($handle: String!) {
                  product: productByHandle(handle: $handle) {
                    id
                    title
                    handle
                    description
                    onlineStoreUrl
                    availableForSale
                    productType
                    priceRange {
                      maxVariantPrice {
                        amount
                        currencyCode
                      }
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    variants(first: 100) {
                      edges {
                        node {
                          id
                          sku
                          title
                          weight
                          weightUnit
                          image {
                            src: transformedSrc(
                              crop: CENTER
                              maxWidth: 500
                              maxHeight: 500
                            )
                          }
                        }
                      }
                    }
                  }
                }
              `,
            variables: { handle: block.shopifyProductId },
          }),
        },
      );

      setShopifyProduct((await response.json()).data.product);
    }

    setVariantId(null);

    run();
  }, [block.shopifyProductId]);

  if (!shopifyProduct) {
    return null;
  }

  const currentVariant = variantId
    ? shopifyProduct.variants.edges.find((v) => v.node.id === variantId).node
    : shopifyProduct.variants.edges[0].node;

  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.left}>
          <div className={s.category}>
            Category: {shopifyProduct.productType}
          </div>
          <div className={s.title}>{shopifyProduct.title}</div>
          <div className={s.price}>
            {currencies[shopifyProduct.priceRange.maxVariantPrice.currencyCode]}{' '}
            {shopifyProduct.priceRange.maxVariantPrice.amount}
          </div>
          <div className={s.description}>{shopifyProduct.description}</div>

          <div className={s.actions}>
            <div className={s.variants}>
              <div>Select a variant:</div>
              <select onChange={(e) => setVariantId(e.target.value)}>
                {shopifyProduct.variants.edges.map(({ node: variant }) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.title}
                  </option>
                ))}
              </select>
            </div>
            <Button as="div">
              <CartIcon />
              Add to cart
            </Button>
          </div>
        </div>
        <div className={s.right}>
          <img src={currentVariant.image.src} alt={currentVariant.title} />
        </div>
      </div>
    </Wrapper>
  );
}
