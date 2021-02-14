import { Component, OnInit } from '@angular/core';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  public entries: Entry[] = [];

  constructor(
    private entryServices: EntryService
  ) { }

  ngOnInit(): void {
    this.entryServices.getAll().subscribe(entries => {
      this.entries = entries.sort((a, b) => b.id - a.id);
    }, error => {
      console.error(error);
      alert('Erro ao carregar a lista');
    });
  }

  deleteEntry(entry: Entry): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.entryServices.delete(entry.id).subscribe(() => {
        this.entries = this.entries.filter(element => element != entry);
      }, error => {
        console.error(error);
        alert('Erro ao tentar excluir');
      });
    }
  }

}
