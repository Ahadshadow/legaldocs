export interface Signer {
    id: string;
    name: string;
    email: string;
    role: 'landlord' | 'tenant';
    signed: boolean;
    signatureDate?: Date;
  }
  
  export interface SignatureField {
    id: string;
    type: 'signature' | 'name' | 'date' | 'email' | 'company' | 'title' | 'text' | 'dropdown' | 'checkbox';
    label: string;
    required: boolean;
    value?: string;
    signerId: string;
  }
  
  