export interface AttributeValue {
  id: number;
  value: string;
}

export interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}
