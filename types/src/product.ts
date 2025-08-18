export type ProductEntity = {
  id: string;  // Vehicle Registration ID
  userId: string;
  vin: string;
  engineNumber: string;
  purchaseDate: string;
  registrationDate: string;
  dealerName: string;
  year: number;
  model: string; // mapping to DB
  crmId?: string;
  isVerified: boolean;
  verifyTimes: number
}

export type ProductVO = Omit<ProductEntity, 'crmId' | 'isVerified' | 'verifyTimes' > & {
  verifyStatus?: number,
  img?: string;
}

export type ProductBoVO = ProductEntity & {
  memberId: string;
}

export type ProductDto = Omit<ProductEntity, 'userId' | 'crmId' | 'isVerified' | 'verifyTimes' >

export type CreateProductRequest = Omit<ProductEntity, 'crmId' | 'isVerified' | 'verifyTimes' >

export type ProductUpdateDto =  {
    id: string;
    data: UpdateProductData;
}

export type UpdateProductData =
  Partial<Pick<ProductEntity,
    'vin' |
    'engineNumber' |
    'dealerName' |
    'year'|
    'purchaseDate' |
    'registrationDate' |
    'crmId' |
    'isVerified' |
    'verifyTimes'
  >>;

export type ProductRemoveDto = {
    id: string
}
