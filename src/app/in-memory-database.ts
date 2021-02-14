import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      { id: 1, name: "Lazer", description: "Cinema, parques, praia, etc" },
      { id: 2, name: "Saúde", description: "Plano de Saúde e Remédios" },
      { id: 3, name: "Moradia", description: "Pagamentos de Contas de Casa" },
      { id: 4, name: "Salário", description: "Recebimento de Salário" },
      { id: 5, name: "Freelas", description: "Trabalhos como frelancer" }
    ];

    const entries: Entry[] = [
      { id: 1, name: "Gas de cozinha", categoryId: categories[0].id, category: categories[0], paid: true, date: '14/10/2020', amount: '70,80', type: "expense", description: "Cinema, parques, praia, etc" } as Entry,
      { id: 1, name: "Suplementos", categoryId: categories[1].id, category: categories[1], paid: false, date: '14/10/2020', amount: '70,80', type: "revenue", description: "Cinema, parques, praia, etc" } as Entry,
    ];

    return { categories, entries };
  }
}
