import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string;
  public categoryForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: string[] = null;
  public submittingForm: boolean = false;
  public category: Category = new Category();

  constructor(
    private categoryServices: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createCategory();
      return;
    }

    this.updateCategory();
  }

  private setCurrentAction(): void {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
      return;
    }

    this.currentAction = 'edit';
  }

  private buildCategoryForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryServices.getById(+params.get('id')))
      ).subscribe(category => {
        this.category = category;
        this.categoryForm.patchValue(category);
      }, error => {
        console.error(error);
        alert('Ocorreu um erro no servidor, tente novamente');
      })
    }
  }

  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
      return;
    }

    this.pageTitle = `Editando Categoria: ${this.category.name || ''}`;
  }

  private createCategory(): void {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryServices.create(category).subscribe(category => {
      this.actionsForSuccess(category);
    }, error => {
      console.error(error);
      this.actionsForError(error);
    });
  }

  private updateCategory(): void {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryServices.update(category).subscribe(category => {
      this.actionsForSuccess(category);
    }, error => {
      console.error(error);
      this.actionsForError(error);
    });
  }

  private actionsForSuccess(category: Category): void {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(() => {
      this.router.navigate(['categories', category.id, 'edit']);
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
