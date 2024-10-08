import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SphereComponent } from './sphere.component';

describe('SphereComponent', () => {
  let component: SphereComponent;
  let fixture: ComponentFixture<SphereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SphereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SphereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
