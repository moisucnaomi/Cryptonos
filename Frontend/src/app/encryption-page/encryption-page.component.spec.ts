import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptionPageComponent } from './encryption-page.component';

describe('EncryptionPageComponent', () => {
  let component: EncryptionPageComponent;
  let fixture: ComponentFixture<EncryptionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncryptionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
