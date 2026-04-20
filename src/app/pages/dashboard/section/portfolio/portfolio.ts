import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PortfolioModel } from '../../../../models/portfolio.model';
import { RealtimePortfolioService } from '../../../../services/realtime-portfolio.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portfolio-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio implements OnInit {
  form!: FormGroup;

  portfolioList: PortfolioModel[] = [];
  loading = false;
  saving = false;
  editingId: string | null = null;
  showForm = false;

  selectedGalleryFiles: File[] = [];
  selectedCoverFile: File | null = null;

  existingGalleryFiles: string[] = [];
  removedGalleryFiles: string[] = [];

  existingCoverFile: string | null = null;
  removeExistingCover = false;

  editingRecord: PortfolioModel | null = null;

  typeOptions = [
    'industrial',
    'infraestructura',
    'comercial',
    'residencial',
    'tecnologia',
    'automatizacion',
    'seguridad'
  ];

  statusOptions: Array<'borrador' | 'publicado'> = ['borrador', 'publicado'];

  constructor(
    private fb: FormBuilder,
    public realtimePortfolioService: RealtimePortfolioService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.buildForm();
    await this.loadData();
    this.changeDetectorRef.detectChanges();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      clientProblem: [''],
      implementedSolution: [''],
      result: [''],
      featured: [false],
      status: ['borrador', Validators.required],
      orderIndex: [0],
      year: [null]
    });
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
      await this.realtimePortfolioService.loadPortfolio();
      this.realtimePortfolioService.portfolio$.subscribe(data => {
        this.portfolioList = data;
      });
    } catch (error) {
      console.error('Error cargando portfolio:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los proyectos.'
      });
    } finally {
      this.loading = false;
    }
  }

  openCreateForm(): void {
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  onGalleryChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles = Array.from(input.files);
    this.selectedGalleryFiles = [...this.selectedGalleryFiles, ...newFiles];

    input.value = '';
  }
  

  onCoverChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedCoverFile = input.files[0];
    this.removeExistingCover = false;
    input.value = '';
  }

  removeSelectedGalleryFile(index: number): void {
    this.selectedGalleryFiles.splice(index, 1);
    this.selectedGalleryFiles = [...this.selectedGalleryFiles];
  }

  removeExistingGalleryFile(fileName: string): void {
    this.removedGalleryFiles.push(fileName);
    this.existingGalleryFiles = this.existingGalleryFiles.filter(file => file !== fileName);
  }

  removeCoverSelection(): void {
    this.selectedCoverFile = null;
  }

  removeCurrentCover(): void {
    this.selectedCoverFile = null;
    this.existingCoverFile = null;
    this.removeExistingCover = true;
  }

 async submit(): Promise<void> {
  if (this.form.invalid) {
    this.form.markAllAsTouched();

    await Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Completa los campos obligatorios.'
    });
    return;
  }

  try {
    this.saving = true;

    const value = this.form.value;

    const payload: any = {
      name: value.name,
      slug: this.realtimePortfolioService.buildSlug(value.name),
      location: value.location,
      type: value.type,
      category: value.category,
      description: value.description,
      clientProblem: value.clientProblem || '',
      implementedSolution: value.implementedSolution || '',
      result: value.result || '',
      featured: !!value.featured,
      status: value.status
    };

    if (value.orderIndex !== null && value.orderIndex !== undefined && value.orderIndex !== '') {
      payload.orderIndex = Number(value.orderIndex);
    }

    if (value.year !== null && value.year !== undefined && value.year !== '') {
      payload.year = Number(value.year);
    }

    if (this.editingId) {
      if (this.removedGalleryFiles.length) {
        await this.realtimePortfolioService.removeGalleryFiles(this.editingId, this.removedGalleryFiles);
      }

      if (this.removeExistingCover) {
        await this.realtimePortfolioService.clearCover(this.editingId);
      }

      if (this.selectedCoverFile) {
        payload.cover = this.selectedCoverFile;
      }

      // 1) actualiza datos base
      await this.realtimePortfolioService.updatePortfolio(this.editingId, payload);

      // 2) agrega nuevas imágenes de galería por separado
      if (this.selectedGalleryFiles.length) {
        await this.realtimePortfolioService.appendGalleryFiles(this.editingId, this.selectedGalleryFiles);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'El proyecto fue actualizado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    } else {
      if (this.selectedCoverFile) {
        payload.cover = this.selectedCoverFile;
      }

      if (this.selectedGalleryFiles.length) {
        payload.gallery = this.selectedGalleryFiles;
      }

      await this.realtimePortfolioService.createPortfolio(payload);

      await Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'El proyecto fue creado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    }

    await this.realtimePortfolioService.loadPortfolio();
    this.closeForm();
  } catch (error) {
    console.error('Error guardando proyecto:', error);

    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No fue posible guardar el proyecto.'
    });
  } finally {
    this.saving = false;
  }
}

  editItem(item: PortfolioModel): void {
    this.editingId = item.id || null;
    this.editingRecord = item;
    this.showForm = true;

    this.form.patchValue({
      name: item.name || '',
      location: item.location || '',
      type: item.type || '',
      category: item.category || '',
      description: item.description || '',
      clientProblem: item.clientProblem || '',
      implementedSolution: item.implementedSolution || '',
      result: item.result || '',
      featured: !!item.featured,
      status: item.status || 'borrador',
      orderIndex: item.orderIndex ?? 0,
      year: item.year ?? null
    });

    this.selectedGalleryFiles = [];
    this.selectedCoverFile = null;

    this.existingGalleryFiles = [...(item.gallery || [])];
    this.removedGalleryFiles = [];

    this.existingCoverFile = item.cover || null;
    this.removeExistingCover = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteItem(id?: string): Promise<void> {
    if (!id) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar proyecto?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (!result.isConfirmed) return;

    try {
      await this.realtimePortfolioService.deletePortfolio(id);

      if (this.editingId === id) {
        this.closeForm();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El proyecto fue eliminado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error eliminando proyecto:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible eliminar el proyecto.'
      });
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.editingRecord = null;

    this.selectedGalleryFiles = [];
    this.selectedCoverFile = null;

    this.existingGalleryFiles = [];
    this.removedGalleryFiles = [];

    this.existingCoverFile = null;
    this.removeExistingCover = false;

    this.form.reset({
      name: '',
      location: '',
      type: '',
      category: '',
      description: '',
      clientProblem: '',
      implementedSolution: '',
      result: '',
      featured: false,
      status: 'borrador',
      orderIndex: 0,
      year: null
    });
  }

  getCoverUrl(item: any): string | null {
    if (!item?.cover) return null;
    return this.realtimePortfolioService.getFileUrl(item, item.cover);
  }

  getExistingCoverUrl(): string | null {
    if (!this.editingRecord || !this.existingCoverFile) return null;
    return this.realtimePortfolioService.getFileUrl(this.editingRecord, this.existingCoverFile);
  }

  getExistingGalleryUrls(): { name: string; url: string }[] {
    if (!this.editingRecord || !this.existingGalleryFiles.length) return [];

    return this.existingGalleryFiles.map(fileName => ({
      name: fileName,
      url: this.realtimePortfolioService.getFileUrl(this.editingRecord, fileName)
    }));
  }
}