import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    INSERT INTO suppliers (id, legal_name, document, document_type, email, status)
    VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Fornecedor Alpha LTDA', '11111111000111', 'CNPJ', 'contato@alpha.com', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'Fornecedor Beta S.A.', '22222222000122', 'CNPJ', 'contato@beta.com', 'active')
    ON CONFLICT (document) DO NOTHING;
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DELETE FROM suppliers WHERE document IN ('11111111000111', '22222222000122');
  `);
};
