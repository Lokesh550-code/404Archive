export interface Category {
  name: string;
  description: string | undefined;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
