import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TeamModel } from '../../../../models/team.model';
import { RealtimeTeamsService } from '../../../../services/realtime-team.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {
  form!: FormGroup;

  teamsList: TeamModel[] = [];
  loading = false;
  saving = false;
  editingId: string | null = null;
  showForm = false;

  selectedImageFile: File | null = null;
  existingImageFile: string | null = null;
  removeExistingImage = false;

  editingRecord: TeamModel | null = null;

  statusOptions: Array<'borrador' | 'publicado'> = ['borrador', 'publicado'];

  constructor(
    private fb: FormBuilder,
    public realtimeTeamsService: RealtimeTeamsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.buildForm();

    this.realtimeTeamsService.teams$.subscribe(data => {
      this.teamsList = data;
    });

    await this.loadData();
    this.changeDetectorRef.detectChanges();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      bio: [''],
      featured: [false],
      status: ['borrador', Validators.required],
      orderIndex: [0],
      linkedin: [''],
      instagram: [''],
      email: ['']
    });
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
      await this.realtimeTeamsService.loadTeams();
    } catch (error) {
      console.error('Error cargando equipo:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el equipo.'
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

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedImageFile = input.files[0];
    this.removeExistingImage = false;
    input.value = '';
  }

  removeImageSelection(): void {
    this.selectedImageFile = null;
  }

  removeCurrentImage(): void {
    this.selectedImageFile = null;
    this.existingImageFile = null;
    this.removeExistingImage = true;
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
        role: value.role,
        bio: value.bio || '',
        featured: !!value.featured,
        status: value.status,
        linkedin: value.linkedin || '',
        instagram: value.instagram || '',
        email: value.email || ''
      };

      if (value.orderIndex !== null && value.orderIndex !== undefined && value.orderIndex !== '') {
        payload.orderIndex = Number(value.orderIndex);
      }

      if (this.editingId) {
        if (this.removeExistingImage) {
          await this.realtimeTeamsService.clearImage(this.editingId);
        }

        if (this.selectedImageFile) {
          payload.image = this.selectedImageFile;
        }

        await this.realtimeTeamsService.updateTeam(this.editingId, payload);

        await Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El integrante fue actualizado correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      } else {
        if (this.selectedImageFile) {
          payload.image = this.selectedImageFile;
        }

        await this.realtimeTeamsService.createTeam(payload);

        await Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El integrante fue creado correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      }

      await this.realtimeTeamsService.loadTeams();
      this.closeForm();
    } catch (error) {
      console.error('Error guardando integrante:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible guardar el integrante.'
      });
    } finally {
      this.saving = false;
    }
  }

  editItem(item: TeamModel): void {
    this.editingId = item.id || null;
    this.editingRecord = item;
    this.showForm = true;

    this.form.patchValue({
      name: item.name || '',
      role: item.role || '',
      bio: item.bio || '',
      featured: !!item.featured,
      status: item.status || 'borrador',
      orderIndex: item.orderIndex ?? 0,
      linkedin: item.linkedin || '',
      instagram: item.instagram || '',
      email: item.email || ''
    });

    this.selectedImageFile = null;
    this.existingImageFile = item.image || null;
    this.removeExistingImage = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteItem(id?: string): Promise<void> {
    if (!id) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar integrante?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (!result.isConfirmed) return;

    try {
      await this.realtimeTeamsService.deleteTeam(id);

      if (this.editingId === id) {
        this.closeForm();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El integrante fue eliminado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error eliminando integrante:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible eliminar el integrante.'
      });
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.editingRecord = null;

    this.selectedImageFile = null;
    this.existingImageFile = null;
    this.removeExistingImage = false;

    this.form.reset({
      name: '',
      role: '',
      bio: '',
      featured: false,
      status: 'borrador',
      orderIndex: 0,
      linkedin: '',
      instagram: '',
      email: ''
    });
  }

  getImageUrl(item: any): string | null {
    if (!item?.image) return null;
    return this.realtimeTeamsService.getFileUrl(item, item.image);
  }

  getExistingImageUrl(): string | null {
    if (!this.editingRecord || !this.existingImageFile) return null;
    return this.realtimeTeamsService.getFileUrl(this.editingRecord, this.existingImageFile);
  }
}
