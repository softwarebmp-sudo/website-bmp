import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { TestimonialModel } from '../../../../models/testimonial.model';
import { RealtimeTestimonialsService } from '../../../../services/realtime-testimonial.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials implements OnInit {
  form!: FormGroup;

  testimonialsList: TestimonialModel[] = [];
  loading = false;
  saving = false;
  editingId: string | null = null;
  showForm = false;

  selectedAvatarFile: File | null = null;
  existingAvatarFile: string | null = null;
  removeExistingAvatar = false;

  editingRecord: TestimonialModel | null = null;

  statusOptions: Array<'borrador' | 'publicado'> = ['borrador', 'publicado'];

  constructor(
    private fb: FormBuilder,
    public realtimeTestimonialsService: RealtimeTestimonialsService,
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
      role: [''],
      company: [''],
      message: ['', Validators.required],
      featured: [false],
      status: ['borrador', Validators.required],
      orderIndex: [0]
    });
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
      await this.realtimeTestimonialsService.loadTestimonials();
      this.realtimeTestimonialsService.testimonials$.subscribe(data => {
        this.testimonialsList = data;
      });
    } catch (error) {
      console.error('Error cargando testimonios:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los testimonios.'
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

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedAvatarFile = input.files[0];
    this.removeExistingAvatar = false;
    input.value = '';
  }

  removeAvatarSelection(): void {
    this.selectedAvatarFile = null;
  }

  removeCurrentAvatar(): void {
    this.selectedAvatarFile = null;
    this.existingAvatarFile = null;
    this.removeExistingAvatar = true;
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
        role: value.role || '',
        company: value.company || '',
        message: value.message,
        featured: !!value.featured,
        status: value.status
      };

      if (value.orderIndex !== null && value.orderIndex !== undefined && value.orderIndex !== '') {
        payload.orderIndex = Number(value.orderIndex);
      }

      if (this.editingId) {
        if (this.removeExistingAvatar) {
          await this.realtimeTestimonialsService.clearAvatar(this.editingId);
        }

        if (this.selectedAvatarFile) {
          payload.avatar = this.selectedAvatarFile;
        }

        await this.realtimeTestimonialsService.updateTestimonial(this.editingId, payload);

        await Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El testimonio fue actualizado correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      } else {
        if (this.selectedAvatarFile) {
          payload.avatar = this.selectedAvatarFile;
        }

        await this.realtimeTestimonialsService.createTestimonial(payload);

        await Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El testimonio fue creado correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      }

      await this.realtimeTestimonialsService.loadTestimonials();
      this.closeForm();
    } catch (error) {
      console.error('Error guardando testimonio:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible guardar el testimonio.'
      });
    } finally {
      this.saving = false;
    }
  }

  editItem(item: TestimonialModel): void {
    this.editingId = item.id || null;
    this.editingRecord = item;
    this.showForm = true;

    this.form.patchValue({
      name: item.name || '',
      role: item.role || '',
      company: item.company || '',
      message: item.message || '',
      featured: !!item.featured,
      status: item.status || 'borrador',
      orderIndex: item.orderIndex ?? 0
    });

    this.selectedAvatarFile = null;
    this.existingAvatarFile = item.avatar || null;
    this.removeExistingAvatar = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteItem(id?: string): Promise<void> {
    if (!id) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar testimonio?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (!result.isConfirmed) return;

    try {
      await this.realtimeTestimonialsService.deleteTestimonial(id);

      if (this.editingId === id) {
        this.closeForm();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El testimonio fue eliminado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error eliminando testimonio:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible eliminar el testimonio.'
      });
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.editingRecord = null;

    this.selectedAvatarFile = null;
    this.existingAvatarFile = null;
    this.removeExistingAvatar = false;

    this.form.reset({
      name: '',
      role: '',
      company: '',
      message: '',
      featured: false,
      status: 'borrador',
      orderIndex: 0
    });
  }

  getAvatarUrl(item: any): string | null {
    if (!item?.avatar) return null;
    return this.realtimeTestimonialsService.getFileUrl(item, item.avatar);
  }

  getExistingAvatarUrl(): string | null {
    if (!this.editingRecord || !this.existingAvatarFile) return null;
    return this.realtimeTestimonialsService.getFileUrl(this.editingRecord, this.existingAvatarFile);
  }
}