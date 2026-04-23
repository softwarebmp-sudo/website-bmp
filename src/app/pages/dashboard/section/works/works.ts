import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RealtimeWorksService } from '../../../../services/realtime-work.service';
import { WorkModel } from '../../../../models/work.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './works.html',
  styleUrl: './works.scss',
})
export class Works implements OnInit {
  form!: FormGroup;

  worksList: WorkModel[] = [];
  loading = false;
  saving = false;
  editingId: string | null = null;
  showForm = false;

  selectedPhotoFiles: File[] = [];
  existingPhotoFiles: string[] = [];
  removedPhotoFiles: string[] = [];

  editingRecord: WorkModel | null = null;

  statusOptions: Array<'borrador' | 'publicado'> = ['borrador', 'publicado'];

  categoryOptions: string[] = [
    'obra gris',
    'acabados',
    'estructura',
    'instalaciones',
    'supervisión',
    'remodelación',
    'urbanismo',
    'otro'
  ];

  constructor(
    private fb: FormBuilder,
    public realtimeWorksService: RealtimeWorksService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.buildForm();

    this.realtimeWorksService.works$.subscribe(data => {
      this.worksList = data;
    });

    await this.loadData();
    this.changeDetectorRef.detectChanges();
  }

  buildForm(): void {
    this.form = this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      location: [''],
      category: ['', Validators.required],
      featured: [false],
      status: ['borrador', Validators.required],
      orderIndex: [0]
    });
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
      await this.realtimeWorksService.loadWorks();
    } catch (error) {
      console.error('Error cargando avances:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los avances.'
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

  onPhotosChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles = Array.from(input.files);
    this.selectedPhotoFiles = [...this.selectedPhotoFiles, ...newFiles];
    input.value = '';
  }

  removeSelectedPhoto(index: number): void {
    this.selectedPhotoFiles.splice(index, 1);
    this.selectedPhotoFiles = [...this.selectedPhotoFiles];
  }

  removeExistingPhoto(fileName: string): void {
    this.removedPhotoFiles.push(fileName);
    this.existingPhotoFiles = this.existingPhotoFiles.filter(file => file !== fileName);
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
        projectName: value.projectName,
        description: value.description,
        location: value.location || '',
        category: value.category || '',
        featured: !!value.featured,
        status: value.status
      };

      if (value.orderIndex !== null && value.orderIndex !== undefined && value.orderIndex !== '') {
        payload.orderIndex = Number(value.orderIndex);
      }

      if (this.editingId) {
        if (this.removedPhotoFiles.length) {
          await this.realtimeWorksService.removePhotos(this.editingId, this.removedPhotoFiles);
        }

        await this.realtimeWorksService.updateWork(this.editingId, payload);

        if (this.selectedPhotoFiles.length) {
          await this.realtimeWorksService.appendPhotos(this.editingId, this.selectedPhotoFiles);
        }

        await Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El avance fue actualizado correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      } else {
        if (this.selectedPhotoFiles.length) {
          payload.photos = this.selectedPhotoFiles;
        }

        await this.realtimeWorksService.createWork(payload);

        await Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El avance fue creado correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      }

      await this.realtimeWorksService.loadWorks();
      this.closeForm();
    } catch (error) {
      console.error('Error guardando avance:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible guardar el avance.'
      });
    } finally {
      this.saving = false;
    }
  }

  editItem(item: WorkModel): void {
    this.editingId = item.id || null;
    this.editingRecord = item;
    this.showForm = true;

    this.form.patchValue({
      projectName: item.projectName || '',
      description: item.description || '',
      location: item.location || '',
      category: item.category || '',
      featured: !!item.featured,
      status: item.status || 'borrador',
      orderIndex: item.orderIndex ?? 0
    });

    this.selectedPhotoFiles = [];
    this.existingPhotoFiles = [...(item.photos || [])];
    this.removedPhotoFiles = [];

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteItem(id?: string): Promise<void> {
    if (!id) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar avance?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (!result.isConfirmed) return;

    try {
      await this.realtimeWorksService.deleteWork(id);

      if (this.editingId === id) {
        this.closeForm();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El avance fue eliminado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error eliminando avance:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible eliminar el avance.'
      });
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.editingRecord = null;

    this.selectedPhotoFiles = [];
    this.existingPhotoFiles = [];
    this.removedPhotoFiles = [];

    this.form.reset({
      projectName: '',
      description: '',
      location: '',
      category: '',
      featured: false,
      status: 'borrador',
      orderIndex: 0
    });
  }

  getExistingPhotoUrls(): { name: string; url: string }[] {
    if (!this.editingRecord || !this.existingPhotoFiles.length) return [];

    return this.existingPhotoFiles.map(fileName => ({
      name: fileName,
      url: this.realtimeWorksService.getFileUrl(this.editingRecord, fileName)
    }));
  }

  getMainPhotoUrl(item: any): string | null {
    if (!item?.photos?.length) return null;
    return this.realtimeWorksService.getFileUrl(item, item.photos[0]);
  }
}
