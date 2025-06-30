import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactiraComponent } from './factira.component';

describe('FactiraComponent', () => {
  let component: FactiraComponent;
  let fixture: ComponentFixture<FactiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactiraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
