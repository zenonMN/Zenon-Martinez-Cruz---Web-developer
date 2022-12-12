import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyandsellComponent } from './buyandsell.component';

describe('BuyandsellComponent', () => {
  let component: BuyandsellComponent;
  let fixture: ComponentFixture<BuyandsellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyandsellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyandsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
