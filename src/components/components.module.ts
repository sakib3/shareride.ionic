import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
@NgModule({
	declarations: [MapComponent],
	imports: [],
  exports: [MapComponent],
  providers: [ AuthServiceProvider]
})
export class ComponentsModule {}
