import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMecanicoComponent } from './home-mecanico.component';

describe('HomeMecanicoComponent', () => {
  let component: HomeMecanicoComponent;
  let fixture: ComponentFixture<HomeMecanicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeMecanicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeMecanicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
