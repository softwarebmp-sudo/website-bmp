import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServices } from './add-services';

describe('AddServices', () => {
  let component: AddServices;
  let fixture: ComponentFixture<AddServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
