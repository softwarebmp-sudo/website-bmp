import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeams } from './add-teams';

describe('AddTeams', () => {
  let component: AddTeams;
  let fixture: ComponentFixture<AddTeams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
