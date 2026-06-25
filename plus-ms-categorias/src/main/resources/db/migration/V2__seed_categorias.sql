INSERT INTO categorias (nome, descricao, ativo) VALUES 
('Camisetas', 'Camisetas manga longa e curta', true),
('Calças', 'Calças jeans, sarja e moletom', true),
('Vestidos', 'Vestidos casuais e de festa', true),
('Acessórios', 'Cintos, bonés e outros acessórios', true)
ON CONFLICT (nome) DO NOTHING;
