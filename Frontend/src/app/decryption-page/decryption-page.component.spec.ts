import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecryptionPageComponent } from './decryption-page.component';

describe('DecryptionPageComponent', () => {
  let component: DecryptionPageComponent;
  let fixture: ComponentFixture<DecryptionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecryptionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecryptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
