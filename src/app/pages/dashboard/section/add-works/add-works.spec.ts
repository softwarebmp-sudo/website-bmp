import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorks } from './add-works';

describe('AddWorks', () => {
  let component: AddWorks;
  let fixture: ComponentFixture<AddWorks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
