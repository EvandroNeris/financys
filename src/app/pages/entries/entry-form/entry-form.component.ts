import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string;
  public entryForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: string[] = null;
  public submittingForm: boolean = false;
  public entry: Entry = new Entry();

  constructor(
    private entryServices: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createEntry();
      return;
    }

    this.updateEntry();
  }

  private setCurrentAction(): void {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
      return;
    }

    this.currentAction = 'edit';
  }

  private buildEntryForm(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryServices.getById(+params.get('id')))
      ).subscribe(entry => {
        this.entry = entry;
        this.entryForm.patchValue(entry);
      }, error => {
        console.error(error);
        alert('Ocorreu um erro no servidor, tente novamente');
      })
    }
  }

  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Novo Lançamento';
      return;
    }

    this.pageTitle = `Editando Lançamento: ${this.entry.name || ''}`;
  }

  private createEntry(): void {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryServices.create(entry).subscribe(entry => {
      this.actionsForSuccess(entry);
    }, error => {
      console.error(error);
      this.actionsForError(error);
    });
  }

  private updateEntry(): void {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryServices.update(entry).subscribe(entry => {
      this.actionsForSuccess(entry);
    }, error => {
      console.error(error);
      this.actionsForError(error);
    });
  }

  private actionsForSuccess(entry: Entry): void {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(() => {
      this.router.navigate(['entries', entry.id, 'edit']);
    });
  }

  private actionsForError(error: any): void {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error.message).errors;
      return;
    }

    this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
  }
}
