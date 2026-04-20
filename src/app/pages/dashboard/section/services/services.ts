import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceModel } from '../../../../models/services.model';
import { RealtimeServicesService } from '../../../../services/realtime-services.service';

@Component({
  selector: 'app-services-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services implements OnInit {
  form!: FormGroup;

  servicesList: ServiceModel[] = [];
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

  editingRecord: ServiceModel | null = null;

  statusOptions: Array<'borrador' | 'publicado'> = ['borrador', 'publicado'];

  constructor(
    private fb: FormBuilder,
    public realtimeServicesService: RealtimeServicesService,
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
      description: ['', Validators.required],
      benefits: [''],
      useCases: [''],
      featured: [false],
      status: ['borrador', Validators.required],
      orderIndex: [0]
    });
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
      await this.realtimeServicesService.loadServices();
      this.realtimeServicesService.services$.subscribe(data => {
        this.servicesList = data;
      });
    } catch (error) {
      console.error('Error cargando servicios:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los servicios.'
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
        slug: this.realtimeServicesService.buildSlug(value.name),
        description: value.description,
        benefits: value.benefits || '',
        useCases: value.useCases || '',
        featured: !!value.featured,
        status: value.status
      };

      if (value.orderIndex !== null && value.orderIndex !== undefined && value.orderIndex !== '') {
        payload.orderIndex = Number(value.orderIndex);
      }

      if (this.editingId) {
        if (this.removedGalleryFiles.length) {
          await this.realtimeServicesService.removeGalleryFiles(this.editingId, this.removedGalleryFiles);
        }

        if (this.removeExistingCover) {
          await this.realtimeServicesService.clearCover(this.editingId);
        }

        if (this.selectedCoverFile) {
          payload.cover = this.selectedCoverFile;
        }

        await this.realtimeServicesService.updateService(this.editingId, payload);

        if (this.selectedGalleryFiles.length) {
          await this.realtimeServicesService.appendGalleryFiles(this.editingId, this.selectedGalleryFiles);
        }

        await Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El servicio fue actualizado correctamente.',
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

        await this.realtimeServicesService.createService(payload);

        await Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El servicio fue creado correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      }

      await this.realtimeServicesService.loadServices();
      this.closeForm();
    } catch (error) {
      console.error('Error guardando servicio:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible guardar el servicio.'
      });
    } finally {
      this.saving = false;
    }
  }

  editItem(item: ServiceModel): void {
    this.editingId = item.id || null;
    this.editingRecord = item;
    this.showForm = true;

    this.form.patchValue({
      name: item.name || '',
      description: item.description || '',
      benefits: item.benefits || '',
      useCases: item.useCases || '',
      featured: !!item.featured,
      status: item.status || 'borrador',
      orderIndex: item.orderIndex ?? 0
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
      title: '¿Eliminar servicio?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (!result.isConfirmed) return;

    try {
      await this.realtimeServicesService.deleteService(id);

      if (this.editingId === id) {
        this.closeForm();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El servicio fue eliminado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error eliminando servicio:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible eliminar el servicio.'
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
      description: '',
      benefits: '',
      useCases: '',
      featured: false,
      status: 'borrador',
      orderIndex: 0
    });
  }

  getCoverUrl(item: any): string | null {
    if (!item?.cover) return null;
    return this.realtimeServicesService.getFileUrl(item, item.cover);
  }

  getExistingCoverUrl(): string | null {
    if (!this.editingRecord || !this.existingCoverFile) return null;
    return this.realtimeServicesService.getFileUrl(this.editingRecord, this.existingCoverFile);
  }

  getExistingGalleryUrls(): { name: string; url: string }[] {
    if (!this.editingRecord || !this.existingGalleryFiles.length) return [];

    return this.existingGalleryFiles.map(fileName => ({
      name: fileName,
      url: this.realtimeServicesService.getFileUrl(this.editingRecord, fileName)
    }));
  }
}