/**
 * Definições de tipos e interfaces para o domínio de Produtos
 * Microsserviço Plus MFE - Gerenciamento de roupas plus size
 */

/**
 * Grade de tamanhos padrão para produtos plus size
 * Valores suportados: G1, G2, G3, G4, G5, EG (Extra Grande)
 */
export type SizeGrade = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'EG';

/**
 * Variação de cor de um produto
 * Representa uma cor específica com seus dados de exibição e imagens
 * Integração com Media Service para URLs de imagens
 */
export interface ColorVariation {
  /** Nome da cor em linguagem natural (ex: 'Azul', 'Preto', 'Rosa Claro') */
  colorName: string;

  /** Código HEX da cor para renderização na UI (ex: '#0000FF' para azul) */
  colorHex: string;

  /** Lista de URLs de imagens para esta variação de cor específica */
  imageUrls: string[];
}

/**
 * Categoria de produto
 * Integração simples com o Category Service
 */
export interface ProductCategory {
  /** Identificador único da categoria */
  id: string;

  /** Nome da categoria (ex: 'Camisetas', 'Calças', 'Vestidos') */
  name: string;
}

/**
 * Produto principal
 * Representa um item de roupa plus size com suas variações e tamanhos
 */
export interface Product {
  /** Identificador único do produto */
  id: string;

  /** Nome comercial do produto (ex: 'Camiseta Básica Plus Size') */
  name: string;

  /** Descrição detalhada do produto */
  description: string;

  /** Preço do produto em reais (valor unitário) */
  price: number;

  /** Categoria à qual o produto pertence */
  category: ProductCategory;

  /** Array de tamanhos disponíveis desta grade para o produto */
  sizes: SizeGrade[];

  /** Array de variações de cores com suas respectivas imagens */
  variations: ColorVariation[];
}
