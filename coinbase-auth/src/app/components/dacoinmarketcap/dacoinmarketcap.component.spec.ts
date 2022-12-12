import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DacoinmarketcapComponent } from './dacoinmarketcap.component';

describe('DacoinmarketcapComponent', () => {
  let component: DacoinmarketcapComponent;
  let fixture: ComponentFixture<DacoinmarketcapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DacoinmarketcapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DacoinmarketcapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
